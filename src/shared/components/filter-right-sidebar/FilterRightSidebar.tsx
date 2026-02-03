import React, { useEffect, useRef, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotificationRequest } from "../../../store/reducers/notificationSlice";
import type { RootState } from "../../../store/store";
import closeLogo from "../../../assets/icons/x-close.svg";
import "./FilterRightSidebar.css";
import { Accordion, AccordionTab } from "primereact/accordion";

interface FilterSidebarProps {
  visible: boolean;
  onHide: () => void;
}

const FilterRightSidebar: React.FC<FilterSidebarProps> = ({
  visible,
  onHide,
}) => {
  const dispatch = useDispatch();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 15;

  const {
    notifications = [],
    loading,
    totalCount = 0,
  } = useSelector((state: RootState) => state.notifications);

  const hasMore = notifications.length < totalCount;

  // Fetch with append toggle
  const fetchFilters = (page: number) => {
    dispatch(fetchNotificationRequest({ pageNumber: page, pageSize }));
  };

  useEffect(() => {
    setPageNumber(1);
    fetchFilters(1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll handler for infinite scroll
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || loading || !hasMore) return;
    const bottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (bottom < 100) {
      const nextPage = pageNumber + 1;
      setPageNumber(nextPage);
      fetchFilters(nextPage);
    }
  };

  return (
    <Sidebar
      position="right"
      visible={visible}
      onHide={onHide}
      className="filter !w-[30rem] h-screen shadow-lg flex flex-col "
      showCloseIcon={false}
    >
      <div className="flex items-center justify-between p-4 !bg-[#F6F6F6]">
        <h2 className="text-xl font-semibold">Filter</h2>
        <button
          type="button"
          className="rounded-lg hover:bg-[#FFFFFF] p-2 cursor-pointer"
          onClick={onHide}
        >
          <img src={closeLogo} className="w-5 h-5" alt="close" />
        </button>
      </div>
      {/* Scrollable filter list */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="overflow-y-auto p-4 flex-1"
        style={{ maxHeight: "calc(100vh - 95px)", marginBottom: "2rem" }}
      >
        <Accordion activeIndex={0}>
          <AccordionTab header="Header I">
            <p className="m-0">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </AccordionTab>
          <AccordionTab header="Header II">
            <p className="m-0">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
              aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
              eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci
              velit, sed quia non numquam eius modi.
            </p>
          </AccordionTab>
          <AccordionTab header="Header III">
            <p className="m-0">
              At vero eos et accusamus et iusto odio dignissimos ducimus qui
              blanditiis praesentium voluptatum deleniti atque corrupti quos
              dolores et quas molestias excepturi sint occaecati cupiditate non
              provident, similique sunt in culpa qui officia deserunt mollitia
              animi, id est laborum et dolorum fuga. Et harum quidem rerum
              facilis est et expedita distinctio. Nam libero tempore, cum soluta
              nobis est eligendi optio cumque nihil impedit quo minus.
            </p>
          </AccordionTab>
        </Accordion>
      </div>
    </Sidebar>
  );
};

export default FilterRightSidebar;
