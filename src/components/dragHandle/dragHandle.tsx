import { forwardRef, memo } from "react";

interface Props {
  isDragging: boolean;
  day?: number;
  dragWidth: number;
}

const DragHandleComponent = forwardRef<HTMLButtonElement, Props>(
  function (props, ref) {
    const { isDragging, day, dragWidth, ...restProps } = props;

    return (
      <button
        {...restProps}
        ref={ref}
        className={`absolute w-[${dragWidth}px] h-full z-10`}
      >
        <div
          className={
            "w-px bg-[#6F6C83] absolute top-4 bottom-0 -translate-x-1/2"
          }
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
              "absolute bottom-0 opacity-80 translate-y-full -translate-x-1/2 bg-white border rounded text-sm px-0.5"
            }
          >
            {day}
          </div>
        )}
      </button>
    );
  },
);

export const DragHandle = memo(DragHandleComponent);
