import {
  forwardRef,
  memo,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { months } from "../../months.ts";
import { dragWidth } from "../../constants.ts";

const days = Array.from({ length: 365 }, (_, i) => i);

const DragHandle = forwardRef<HTMLButtonElement>(function (props, ref) {
  return (
    <button
      {...props}
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
    </button>
  );
});

const DatePickerComponent = () => {
  const ref = useRef<HTMLDivElement>(null);

  const leftDragRef = useRef(null);
  const rightDragRef = useRef(null);

  const [containerWidth, setContainerWidth] = useState(0);

  const [leftBound, setLeftBound] = useState({ left: 0, right: 0 });
  const [rightBound, setRightBound] = useState({ left: 0, right: 0 });

  const [leftPosition, setLeftPosition] = useState({ x: 0, y: 0 });
  const [rightPosition, setRightPosition] = useState({ x: 0, y: 0 });

  const monthWidth = useMemo(
    () => Math.round(containerWidth / months.length),
    [containerWidth, months],
  );

  const startMonth = useMemo(
    () => Math.floor(leftPosition.x / monthWidth),
    [leftPosition, monthWidth],
  );

  const endMonth = useMemo(
    () => Math.ceil(rightPosition.x / monthWidth),
    [rightPosition, monthWidth],
  );

  const handleDragLeft = useCallback(
    (_: DraggableEvent, data: DraggableData) => {
      setLeftPosition((value) => ({ ...value, x: data.x }));
      setRightBound((value) => ({
        ...value,
        left: data.x + monthWidth,
      }));
    },
    [monthWidth],
  );

  const handleDragRight = useCallback(
    (_: DraggableEvent, data: DraggableData) => {
      setRightPosition((value) => ({ ...value, x: data.x }));
      setLeftBound((value) => ({
        ...value,
        right: data.x - monthWidth,
      }));
    },
    [monthWidth],
  );

  useLayoutEffect(() => {
    if (ref.current) {
      const width = ref.current.getBoundingClientRect().width;
      const monthWidth = Math.round(width / months.length);

      setLeftBound({
        left: dragWidth / 2,
        right: width - dragWidth / 2 - monthWidth,
      });
      setRightBound({
        left: dragWidth / 2 + monthWidth,
        right: width - dragWidth / 2,
      });

      setLeftPosition((value) => ({ ...value, x: dragWidth / 2 }));
      setRightPosition((value) => ({ ...value, x: width - dragWidth / 2 }));

      setContainerWidth(width);
    }
  }, []);

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
          onDrag={handleDragLeft}
          grid={[containerWidth / days.length, 0]}
        >
          <DragHandle ref={leftDragRef} />
        </Draggable>

        <div className={"flex grow border-b border-[#828282]"}>
          {months.map((month, index) => (
            <div
              key={month}
              className={"flex-1 border-r border-[#828282] last:border-r-0 p-1"}
            >
              <div className={"text-[8px] font-bold text-gray-500"}>
                {index + 1}
              </div>
              <div className={"text-sm"}>{month}</div>
            </div>
          ))}
        </div>

        <div className={"flex grow h-6 border-b border-[#828282]"}>
          {days.map((day) => (
            <div key={day} className={"flex-1 border-r border-[#828282]"} />
          ))}
        </div>

        <Draggable
          nodeRef={rightDragRef}
          axis={"x"}
          bounds={rightBound}
          position={rightPosition}
          onDrag={handleDragRight}
        >
          <DragHandle ref={rightDragRef} />
        </Draggable>

        <div
          className={"absolute right-0 top-0 bottom-0 bg-[#D2C9DE] opacity-80"}
          style={{ width: containerWidth - rightPosition.x }}
        />
      </div>

      <div className={"flex grow h-14"}>
        {months.slice(startMonth, endMonth).map((month) => (
          <div
            key={month}
            className={
              "flex flex-1 border-r border-[#828282] last:border-r-0 p-1"
            }
          >
            <div className={"self-end text-[10px]"}>{month}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DatePicker = memo(DatePickerComponent);
