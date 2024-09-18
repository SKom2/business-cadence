import { forwardRef, memo, useRef } from "react";
import Draggable, {
  ControlPosition,
  DraggableBounds,
  DraggableData,
  DraggableEvent,
} from "react-draggable";
import { months } from "../../months.ts";
import { DragHandle } from "../dragHandle/dragHandle.tsx";

interface Props {
  leftPosition: ControlPosition;
  rightPosition: ControlPosition;
  leftBound: DraggableBounds;
  rightBound: DraggableBounds;
  containerWidth: number;
  days: number;
  handleDragLeft: (_: DraggableEvent, data: DraggableData) => void;
  handleDragRight: (_: DraggableEvent, data: DraggableData) => void;
  handleStopLeft: () => void;
  handleStopRight: () => void;
  setIsLeftDragging: (value: boolean) => void;
  setIsRightDragging: (value: boolean) => void;
  isLeftDragging: boolean;
  isRightDragging: boolean;
  startMonthData: null | { name: string; dayOfMonth: number };
  endMonthData: null | { name: string; dayOfMonth: number };
  dragWidth: number;
  startMonth: number;
  endMonth: number;
  weeksBetweenDates: { start: number; end: number }[];
  getDayAndMonth: (dayOfYear: number) => number;
  leftDay: number;
  rightDay: number;
  activeIndex: number | null;
  onMouseEnter: (index: number) => void;
  onMouseLeave: () => void;
}

const DatePickerComponent = forwardRef<HTMLDivElement, Props>(
  function (props, ref) {
    const {
      leftPosition,
      leftBound,
      containerWidth,
      days,
      handleDragLeft,
      handleStopLeft,
      setIsLeftDragging,
      isLeftDragging,
      startMonthData,
      dragWidth,
      rightBound,
      rightPosition,
      handleDragRight,
      handleStopRight,
      setIsRightDragging,
      isRightDragging,
      endMonthData,
      startMonth,
      endMonth,
      weeksBetweenDates,
      getDayAndMonth,
      leftDay,
      rightDay,
      activeIndex,
      onMouseEnter,
      onMouseLeave,
    } = props;

    const leftDragRef = useRef(null);
    const rightDragRef = useRef(null);

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
              dragWidth={dragWidth}
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
                  {Array.from({ length: month.days }, (_, i) => i).map(
                    (day) => (
                      <div
                        key={day}
                        className={"flex-1  border-r border-[#828282]"}
                      />
                    ),
                  )}
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
              dragWidth={dragWidth}
            />
          </Draggable>

          <div
            className={
              "absolute right-0 top-0 bottom-0 bg-[#D2C9DE] opacity-80"
            }
            style={{ width: containerWidth - rightPosition.x }}
          />
        </div>

        <div
          className={"flex grow h-14 border-b border-[#828282] bg-[#EBEBEB]"}
        >
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

        <div className={"flex h-6 bg-[#EBEBEB]"}>
          {weeksBetweenDates.map((week, index, array) => {
            if (array.length === 1) {
              const start = getDayAndMonth(leftDay);
              const end = getDayAndMonth(rightDay);

              return (
                <div
                  key={`${leftDay}${rightDay}`}
                  onMouseEnter={() => onMouseEnter(index)}
                  onMouseLeave={onMouseLeave}
                  className={`flex flex-1 items-center justify-center text-[8px] border-[#828282] border-r ${index === activeIndex ? "bg-[#E4DEFD]" : ""}`}
                >
                  {start === end && start}
                  {start !== end && `${start}-${end}`}
                </div>
              );
            }

            if (index === 0) {
              const start = getDayAndMonth(leftDay);
              const end = getDayAndMonth(week.end);

              return (
                <div
                  key={`${leftDay}${week.end}`}
                  onMouseEnter={() => onMouseEnter(index)}
                  onMouseLeave={onMouseLeave}
                  className={`flex flex-1 items-center justify-center text-[8px] border-[#828282] border-r ${index === activeIndex ? "bg-[#E4DEFD]" : ""}`}
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
                  onMouseEnter={() => onMouseEnter(index)}
                  onMouseLeave={onMouseLeave}
                  className={`flex flex-1 items-center justify-center text-[8px] border-[#828282] border-r ${index === activeIndex ? "bg-[#E4DEFD]" : ""}`}
                >
                  {start === end && start}
                  {start !== end && `${start}-${end}`}
                </div>
              );
            }

            return (
              <div
                key={`${week.start}${week.end}`}
                onMouseEnter={() => onMouseEnter(index)}
                onMouseLeave={onMouseLeave}
                className={`flex flex-1 items-center justify-center text-[8px] border-[#828282] border-r ${index === activeIndex ? "bg-[#E4DEFD]" : ""}`}
              >
                {getDayAndMonth(week.start)}-{getDayAndMonth(week.end)}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

export const DatePicker = memo(DatePickerComponent);
