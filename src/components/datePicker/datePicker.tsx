import {
  forwardRef,
  memo,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { months } from "../../months.ts";
import { dragWidth } from "../../constants.ts";

const days = months.reduce((acc, item) => {
  return acc + item.days;
}, 0);

interface Props {
  isDragging: boolean;
  day?: number;
}

const DragHandle = forwardRef<HTMLButtonElement, Props>(function (props, ref) {
  const { isDragging, day, ...restProps } = props;

  return (
    <button
      {...restProps}
      ref={ref}
      className={`absolute w-[${dragWidth}px] h-full z-10`}
    >
      <div
        className={"w-px bg-[#6F6C83] absolute top-4 bottom-0 -translate-x-1/2"}
      />
      <div
        className={
          "w-2 h-4 border border-[#6F6C83] rounded-sm bg-[#D2C9DE] absolute top-0 -translate-x-1/2"
        }
      >
        <div
          className={
            "h-1.5 w-px bg-[#6F6C83] absolute top-1/2 left-[calc(50%+1px)] -translate-x-1/2 -translate-y-1/2"
          }
        />
        <div
          className={
            "h-1.5 w-px bg-[#6F6C83] absolute top-1/2 left-[calc(50%-1px)] -translate-x-1/2 -translate-y-1/2"
          }
        />
      </div>

      {isDragging && (
        <div
          className={
            "absolute bottom-0 translate-y-full -translate-x-1/2 bg-white border rounded text-sm px-0.5"
          }
        >
          {day}
        </div>
      )}
    </button>
  );
});

const DatePickerComponent = () => {
  const ref = useRef<HTMLDivElement>(null);

  const leftDragRef = useRef(null);
  const rightDragRef = useRef(null);

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
        left: dragWidth / 2,
        right: width - dragWidth / 2 - dragWidth,
      });
      setRightBound({
        left: dragWidth / 2 + dragWidth,
        right: width - dragWidth / 2,
      });

      setLeftPosition((value) => ({ ...value, x: dragWidth / 2 }));
      setRightPosition((value) => ({ ...value, x: width - dragWidth / 2 }));

      setContainerWidth(width);
    }
  }, []);

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

  return (
    <div className={"flex flex-col grow border-b border-[#828282]"}>
      <div className={"flex flex-col grow relative"} ref={ref}>
        <div
          className={"absolute left-0 top-0 bottom-0 bg-[#D2C9DE] opacity-80"}
          style={{ width: leftPosition.x }}
        />

        <Draggable
          nodeRef={leftDragRef}
          axis={"x"}
          bounds={leftBound}
          position={leftPosition}
          grid={[containerWidth / days, 0]}
          onDrag={handleDragLeft}
          onStop={handleStopLeft}
          onMouseDown={() => setIsLeftDragging(true)}
        >
          <DragHandle
            ref={leftDragRef}
            isDragging={isLeftDragging}
            day={(startMonthData?.dayOfMonth ?? 0) + 1}
          />
        </Draggable>

        <div className={"flex grow border-b border-[#828282]"}>
          {months.map((month, index) => (
            <div
              key={month.name}
              className={"flex-1 flex flex-col"}
              style={{ flexGrow: month.days }}
            >
              <div className={"border-b border-[#828282] border-r p-1"}>
                <div className={"text-[8px] font-bold text-gray-500"}>
                  {index + 1}
                </div>
                <div className={"text-sm"}>{month.name}</div>
              </div>

              <div className={"flex grow h-6"}>
                {Array.from({ length: month.days }, (_, i) => i).map((day) => (
                  <div
                    key={day}
                    className={"flex-1  border-r border-[#828282]"}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <Draggable
          nodeRef={rightDragRef}
          axis={"x"}
          bounds={rightBound}
          position={rightPosition}
          grid={[containerWidth / days, 0]}
          onDrag={handleDragRight}
          onStop={handleStopRight}
          onMouseDown={() => setIsRightDragging(true)}
        >
          <DragHandle
            ref={rightDragRef}
            isDragging={isRightDragging}
            day={(endMonthData?.dayOfMonth ?? 0) + 1}
          />
        </Draggable>

        <div
          className={"absolute right-0 top-0 bottom-0 bg-[#D2C9DE] opacity-80"}
          style={{ width: containerWidth - rightPosition.x }}
        />
      </div>

      <div className={"flex grow h-14 border-b border-[#828282]"}>
        {months.slice(startMonth, endMonth + 1).map((month) => (
          <div
            key={month.name}
            className={"flex flex-1 border-r border-[#828282] p-1"}
            style={{ flexGrow: month.days }}
          >
            <div className={"self-end text-[10px]"}>{month.name}</div>
          </div>
        ))}
      </div>

      <div className={"flex h-6"}>
        {getWeeksBetweenDates(leftDay, rightDay).map((week, index, array) => {
          if (index === 0) {
            const start = getDayAndMonth(leftDay);
            const end = getDayAndMonth(week.end);

            return (
              <div
                key={`${leftDay}${week.end}`}
                className={
                  "flex flex-1 items-center justify-center text-[8px] border-[#828282] border-r"
                }
              >
                {start === end && start}
                {start !== end && `${start}-${end}`}
              </div>
            );
          }

          if (index === array.length - 1) {
            const start = getDayAndMonth(week.start);
            const end = getDayAndMonth(rightDay);

            return (
              <div
                key={`${week.start}${rightDay}`}
                className={
                  "flex flex-1 items-center justify-center text-[8px] border-[#828282] border-r"
                }
              >
                {start === end && start}
                {start !== end && `${start}-${end}`}
              </div>
            );
          }

          return (
            <div
              key={`${week.start}${week.end}`}
              className={
                "flex flex-1 items-center justify-center text-[8px] border-[#828282] border-r"
              }
            >
              {getDayAndMonth(week.start)}-{getDayAndMonth(week.end)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const DatePicker = memo(DatePickerComponent);
