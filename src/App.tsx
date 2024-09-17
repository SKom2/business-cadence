import {
  forwardRef,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import "./App.css";
import { GoogleButton } from "./components/googleButton/googleButton.tsx";

const testEvents = [
  {
    id: "1",
    name: "All events",
    hideable: false,
    hidden: false,
    items: [{ id: "1-1", name: "Serbia" }],
  },
  {
    id: "2",
    name: "YouTrack Team",
    hideable: true,
    hidden: false,
    color: "#FFE4E6",
    items: [
      { id: "2-1", name: "Gathering" },
      { id: "2-2", name: "Apps Release" },
      { id: "2-3", name: "Gathering" },
      { id: "2-4", name: "Apps Release" },
    ],
  },
  {
    id: "3",
    name: "Personal",
    hideable: true,
    hidden: false,
    color: "#FEF3C7",
    items: [
      { id: "3-1", name: "Monthly Report" },
      { id: "3-2", name: "Job interviews" },
      { id: "3-3", name: "Workshop for Innovation Jam" },
      { id: "3-4", name: "Monthly Report" },
      { id: "3-5", name: "Monthly Report" },
      { id: "3-6", name: "Workshop for Innovation Jam" },
      { id: "3-7", name: "Monthly Report" },
      { id: "3-8", name: "Service quality analysis" },
      { id: "3-9", name: "Monthly Report" },
      { id: "3-10", name: "Monthly Report" },
      { id: "3-11", name: "Monthly Report" },
      { id: "3-12", name: "Monthly Report" },
    ],
  },
  {
    id: "4",
    name: "JetBrains IDEs Release",
    hideable: true,
    hidden: false,
    color: "#E6F6FC",
    items: [
      { id: "4-1", name: "Release 2024.4" },
      { id: "4-2", name: "Influencer co-lab" },
      { id: "4-3", name: "Release 2024.5" },
      { id: "4-4", name: "Crazy September Campaign" },
    ],
  },
  // {
  //   id: "5",
  //   name: "Public Holidays",
  //   hideable: true,
  //   hidden: false,
  //   color: "#F3EEFE",
  //   items: [
  //     { id: "5-1", name: "Martin Luther King Jr. Day" },
  //     { id: "5-2", name: "Easter holiday" },
  //     { id: "5-3", name: "Summer holiday" },
  //     { id: "5-4", name: "Summer holiday" },
  //   ],
  // },
  {
    id: "6",
    name: "Vacations",
    hideable: true,
    hidden: false,
    color: "#EBF5E1",
    items: [
      { id: "6-1", name: "Serbia" },
      { id: "6-2", name: "Malta" },
      { id: "6-3", name: "USA" },
      { id: "6-4", name: "France" },
      { id: "6-5", name: "London" },
      { id: "6-6", name: "London" },
    ],
  },
  {
    id: "7",
    name: "Preply",
    hideable: true,
    hidden: true,
    color: "#E1F5F0",
    items: [],
  },
  {
    id: "8",
    name: "Gatherings",
    hideable: true,
    hidden: true,
    color: "#FFE4CB",
    items: [],
  },
  {
    id: "9",
    name: "Family",
    hideable: true,
    hidden: true,
    color: "#EBD3FF",
    items: [],
  },
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const days = Array.from({ length: 365 }, (_, i) => i);

const dragWidth = 8;

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

function App() {
  const ref = useRef<HTMLDivElement>(null);
  const leftDragRef = useRef(null);
  const rightDragRef = useRef(null);

  const [events, setEvents] = useState(testEvents);

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
    <div>
      <div className={"flex"}>
        <div
          className={
            "w-48 border-r border-b border-r-[#828282] border-b-[#D2C9DE]"
          }
        >
          <GoogleButton />
        </div>

        <div className={"flex flex-col grow border-b border-[#828282]"}>
          <div className={"flex flex-col grow relative"} ref={ref}>
            <div
              className={
                "absolute left-0 top-0 bottom-0 bg-[#D2C9DE] opacity-80"
              }
              style={{ width: leftPosition.x }}
            />

            <Draggable
              nodeRef={leftDragRef}
              axis={"x"}
              bounds={leftBound}
              position={leftPosition}
              onDrag={handleDragLeft}
            >
              <DragHandle ref={leftDragRef} />
            </Draggable>

            <div className={"flex grow border-b border-[#828282]"}>
              {months.map((month, index) => (
                <div
                  key={month}
                  className={
                    "flex-1 border-r border-[#828282] last:border-r-0 p-1"
                  }
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
              className={
                "absolute right-0 top-0 bottom-0 bg-[#D2C9DE] opacity-80"
              }
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
      </div>

      <div>
        {events.map((event) => (
          <div
            key={event.id}
            className={`flex border-b border-[#CBCBCB] ${event.hidden ? "" : "h-32"}`}
          >
            <div
              className={
                "flex items-start w-48 border-r border-[#CBCBCB] p-2.5"
              }
            >
              <div className={"flex gap-2 items-center"}>
                {event.hideable && (
                  <button
                    className={"rounded"}
                    onClick={() => {
                      setEvents((values) =>
                        values.map((value) =>
                          value.id === event.id
                            ? { ...value, hidden: !value.hidden }
                            : value,
                        ),
                      );
                    }}
                    style={{ backgroundColor: event.color }}
                  >
                    {event.hidden && (
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M6.0705 5.19312L5.17041 6.09308L7.04811 7.96792C5.96589 8.72758 5.12795 9.78556 4.63635 11.013C4.98107 11.868 5.49458 12.6448 6.14622 13.2969C6.79785 13.949 7.57424 14.463 8.42901 14.8083C9.28377 15.1537 10.1994 15.3231 11.1211 15.3067C12.0428 15.2902 12.9518 15.0881 13.7937 14.7125L15.8888 16.8068L16.7888 15.9068L6.0705 5.19312ZM10.157 14.051L10.1461 14.0481C9.77675 13.9471 9.42662 13.7795 9.11379 13.5514C8.59283 13.1715 8.20007 12.6418 7.9879 12.033C7.77779 11.43 7.75468 10.7778 7.92135 10.1617L7.92623 10.1437C8.01678 9.82891 8.15593 9.5302 8.33865 9.25835L9.26787 10.1873L9.26414 10.195C9.10146 10.546 9.05001 10.9385 9.11682 11.3197C9.18411 11.7037 9.36814 12.0576 9.64383 12.3333C9.87851 12.5679 10.1699 12.7361 10.4882 12.8224L10.4934 12.8238C10.5162 12.8299 10.539 12.8356 10.5619 12.8408C10.5935 12.8481 10.6254 12.8545 10.6575 12.8601C11.0415 12.9274 11.4369 12.8746 11.7899 12.709L12.7214 13.6403L12.7004 13.654C12.3316 13.8926 11.9171 14.0517 11.4833 14.1212C11.0412 14.192 10.5891 14.1681 10.157 14.051Z"
                          fill="#19191C"
                          fillOpacity="0.3"
                        />
                        <path
                          d="M13.6532 9.24522C13.2305 8.59341 12.5832 8.11948 11.8342 7.91337C11.4056 7.79713 10.9573 7.77249 10.5185 7.84106L9.5517 6.87443C11.1329 6.53084 12.7846 6.75788 14.2144 7.51536C15.6442 8.27284 16.7598 9.51187 17.3637 11.013C17.0315 11.8422 16.5389 12.5975 15.9141 13.2358L14.1272 11.4493C14.2446 10.6813 14.0759 9.89703 13.6532 9.24522Z"
                          fill="#19191C"
                          fillOpacity="0.3"
                        />
                      </svg>
                    )}

                    {!event.hidden && (
                      <svg
                        className={"ml-px"}
                        width="21"
                        height="22"
                        viewBox="0 0 21 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.7136 8.41979C11.912 8.74722 12.6181 9.98417 12.2906 11.1826C11.9632 12.381 10.7262 13.0871 9.52783 12.7596C8.32942 12.4322 7.62335 11.1952 7.95078 9.99683C8.27822 8.79842 9.51516 8.09235 10.7136 8.41979Z"
                          fill="#19191C"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.59781 6.94241C6.93485 6.03991 8.51187 5.55923 10.125 5.56252C11.7381 5.55924 13.3151 6.03992 14.6522 6.94243C15.9892 7.84493 17.0248 9.12776 17.625 10.6251C17.022 12.1204 15.9857 13.4014 14.6493 14.3035C13.3129 15.2055 11.7374 15.6875 10.125 15.6875C8.51263 15.6875 6.93707 15.2055 5.60066 14.3035C4.26425 13.4014 3.228 12.1204 2.625 10.6251C3.22521 9.12775 4.26078 7.84492 5.59781 6.94241ZM12.5784 13.4202C13.1384 12.934 13.5417 12.2925 13.7372 11.5771C13.867 11.102 13.9019 10.6061 13.84 10.1175C13.7782 9.62898 13.6207 9.1574 13.3765 8.72971C13.1324 8.30203 12.8064 7.92661 12.4172 7.62491C12.028 7.3232 11.5831 7.10112 11.1081 6.97132C10.3926 6.77585 9.63528 6.79692 8.9318 7.03188C8.22832 7.26683 7.61031 7.70511 7.15592 8.29131C6.70153 8.8775 6.43117 9.58527 6.37903 10.3251C6.32689 11.065 6.49531 11.8036 6.86299 12.4478C7.23067 13.0919 7.78111 13.6125 8.44468 13.9438C9.10825 14.2751 9.85517 14.4022 10.591 14.309C11.3268 14.2158 12.0184 13.9065 12.5784 13.4202Z"
                          fill="#19191C"
                        />
                      </svg>
                    )}
                  </button>
                )}
                <div
                  className={`text-xs font-semibold ${!event.hideable ? "ml-[30px]" : ""}`}
                >
                  {event.name}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
