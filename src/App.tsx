import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
} from "react";
import "./App.css";
import { DatePicker } from "./components/datePicker/datePicker.tsx";
import GButton from "./components/googleButton/googleButton.tsx";
import {
  useSession /*, useSessionContext*/,
} from "@supabase/auth-helpers-react";
import { useAppDispatch } from "./services/redux/typeHooks.ts";
import { setSession } from "./services/redux/auth/auth.slice.ts";
import {
  fetchCalendarsWithEvents,
  setItems,
} from "./services/redux/calendars/calendars.slice.ts";
import Calendars from "./components/calendars/Calendars.tsx";
import { testCalendarData } from "./testData.ts";
import { months } from "./months.ts";
import { DraggableData, DraggableEvent } from "react-draggable";
import useResizeObserver from "@react-hook/resize-observer";

const days = months.reduce((acc, item) => {
  return acc + item.days;
}, 0);

function App() {
  const session = useSession();
  // const { isLoading } = useSessionContext();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (session) {
      const fetchGoogleCalendarEvents = async () => {
        try {
          dispatch(setSession(session));
          if (session) {
            dispatch(fetchCalendarsWithEvents(session));
          }
        } catch (error) {
          console.error("Error fetching Google Calendar events:", error);
        }
      };

      fetchGoogleCalendarEvents();
    } else {
      dispatch(setItems(testCalendarData.calendars));
    }
  }, [session, dispatch]);

  const ref = useRef<HTMLDivElement>(null);

  const [containerWidth, setContainerWidth] = useState(0);

  const [isLeftDragging, setIsLeftDragging] = useState(false);
  const [isRightDragging, setIsRightDragging] = useState(false);

  const [leftBound, setLeftBound] = useState({ left: 0, right: 0 });
  const [rightBound, setRightBound] = useState({ left: 0, right: 0 });

  const [leftPosition, setLeftPosition] = useState({ x: 0, y: 0 });
  const [rightPosition, setRightPosition] = useState({ x: 0, y: 0 });

  const oneDay = containerWidth / days;

  const left = leftPosition.x;
  const leftDay = Math.round(left / oneDay);

  const right = rightPosition.x;
  const rightDay = Math.round(right / oneDay);

  const startMonthData = months.reduce<{
    totalDays: number;
    found: null | { name: string; dayOfMonth: number };
  }>(
    (acc, month) => {
      if (!acc.found && leftDay < acc.totalDays + month.days) {
        acc.found = {
          name: month.name,
          dayOfMonth:
            month.name === "January"
              ? leftDay - acc.totalDays - 1
              : leftDay - acc.totalDays,
        };
      }
      acc.totalDays += month.days;
      return acc;
    },
    { totalDays: 0, found: null },
  ).found;

  const endMonthData = months.reduce<{
    totalDays: number;
    found: null | { name: string; dayOfMonth: number };
  }>(
    (acc, month) => {
      if (!acc.found && rightDay < acc.totalDays + month.days) {
        acc.found = {
          name: month.name,
          dayOfMonth:
            month.name === "January"
              ? rightDay - acc.totalDays - 1
              : rightDay - acc.totalDays,
        };
      }
      acc.totalDays += month.days;
      return acc;
    },
    { totalDays: 0, found: null },
  ).found;

  const startMonth = months.findIndex(
    (month) => month.name === startMonthData?.name,
  );
  const endMonth = months.findIndex(
    (month) => month.name === endMonthData?.name,
  );

  const dragWidth = oneDay;

  const initialRightGap = 5 * dragWidth;

  const handleDragLeft = useCallback(
    (_: DraggableEvent, data: DraggableData) => {
      setIsLeftDragging(true);
      setLeftPosition((value) => ({ ...value, x: data.x }));
      setRightBound((value) => ({
        ...value,
        left: data.x + dragWidth,
      }));
    },
    [dragWidth],
  );

  const handleDragRight = useCallback(
    (_: DraggableEvent, data: DraggableData) => {
      setIsRightDragging(true);
      setRightPosition((value) => ({ ...value, x: data.x }));
      setLeftBound((value) => ({
        ...value,
        right: data.x - dragWidth,
      }));
    },
    [dragWidth],
  );

  const handleStopLeft = () => {
    setIsLeftDragging(false);
  };

  const handleStopRight = () => {
    setIsRightDragging(false);
  };

  useLayoutEffect(() => {
    if (ref.current) {
      const width = ref.current.getBoundingClientRect().width;

      setLeftBound({
        left: dragWidth,
        right: width - dragWidth - initialRightGap,
      });
      setRightBound({
        left: dragWidth + dragWidth,
        right: width - dragWidth,
      });

      setLeftPosition((value) => ({ ...value, x: dragWidth }));
      setRightPosition((value) => ({
        ...value,
        x: width - initialRightGap,
      }));

      setContainerWidth(width);
    }
  }, [dragWidth, initialRightGap]);

  function getWeeksBetweenDates(
    startDate: number,
    endDate: number,
  ): { start: number; end: number }[] {
    const weeks: { start: number; end: number }[] = [];

    for (let i = 0; i < 366; i += 7) {
      const start = i + 1;
      const end = Math.min(i + 7, 366);
      weeks.push({ start, end });
    }

    return weeks.filter(
      (week) =>
        (week.start >= startDate && week.start <= endDate) ||
        (week.end >= startDate && week.end <= endDate) ||
        (week.start <= startDate && week.end >= endDate),
    );
  }

  function getDayAndMonth(dayOfYear: number) {
    const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    let month = 0;
    let day = dayOfYear;

    while (day > daysInMonth[month]) {
      day -= daysInMonth[month];
      month++;
    }

    return day;
  }

  const weeksBetweenDates = getWeeksBetweenDates(leftDay, rightDay);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleMouseEnter = (index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  const getToday = () => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const diffInMillis = today.getTime() - startOfYear.getTime();
    return Math.floor(diffInMillis / (1000 * 60 * 60 * 24)) + 1;
  };

  const today = getToday();

  useResizeObserver(ref, (entry) => {
    setContainerWidth(entry.contentRect.width);
  });

  return (
    <div>
      <div className={"flex"}>
        <div
          className={
            "w-[43px] border-r border-b border-r-[#828282] border-b-[#D2C9DE] justify-center items-center md:w-48 overflow-hidden"
          }
        >
          <div className={"hidden md:block"}>{/*<GButton />*/}</div>
        </div>

        <DatePicker
          ref={ref}
          leftPosition={leftPosition}
          leftBound={leftBound}
          containerWidth={containerWidth}
          days={days}
          handleDragLeft={handleDragLeft}
          handleStopLeft={handleStopLeft}
          setIsLeftDragging={setIsLeftDragging}
          isLeftDragging={isLeftDragging}
          startMonthData={startMonthData}
          dragWidth={dragWidth}
          rightBound={rightBound}
          rightPosition={rightPosition}
          handleDragRight={handleDragRight}
          handleStopRight={handleStopRight}
          setIsRightDragging={setIsRightDragging}
          isRightDragging={isRightDragging}
          endMonthData={endMonthData}
          startMonth={startMonth}
          endMonth={endMonth}
          weeksBetweenDates={weeksBetweenDates}
          getDayAndMonth={getDayAndMonth}
          leftDay={leftDay}
          rightDay={rightDay}
          activeIndex={activeIndex}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          isDragging={isLeftDragging || isRightDragging}
        />
      </div>

      <Calendars
        weeksBetweenDates={weeksBetweenDates}
        activeIndex={activeIndex}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        today={today}
        isDragging={isLeftDragging || isRightDragging}
        startMonth={startMonth}
        endMonth={endMonth}
        leftDay={leftDay}
        rightDay={rightDay}
      />
    </div>
  );
}

export default App;
