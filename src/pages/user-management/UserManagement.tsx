import { useEffect, useRef, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import MainPageHeader from "../../shared/components/main-page-header/MainPageHeader";
import AtsPaginator from "../../shared/components/ats-pagination/Pagination";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import {
  addUserResendRequest,
  addUserRevokeRequest,
  fetchUserManagementRequest,
  searchUserManagementRequest,
} from "../../store/reducers/userManagementSlice";
import EmptyState from "../../shared/components/empty-state/EmptyState";
import { getUserStatusClasses } from "../../services/common";
import PenSvg from "../../assets/icons/pen.svg";
import CustomConfirmDialog from "../../shared/components/custom-confirm-dialog/CustomConfirmDialog";
import InfoSvg from "../../assets/icons/info.svg";
import UserFilterDrawer, {
  type FilterValues,
} from "./components/UserFilterDrawer";
import AtsLoader from "../../shared/components/ats-loader/AtsLoader";
import { Menu } from "primereact/menu";
import { MoreVertical } from "lucide-react";

const UserManagement = () => {
  const isFirstRender = useRef(true);
  const isFilterDataFetched = useRef(false);

  // This maintains the master list used for generating filter checkboxes
  const [masterFilterOptions, setMasterFilterOptions] = useState<any[]>([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(15);
  const [searchTerm, setSearchTerm] = useState("");
  const [revokeDialogVisible, setRevokeDialogVisible] = useState(false);
  const [userTarget, setUserTarget] = useState<{ employeeId: number } | null>(
    null
  );
  const [resendDialogVisible, setResendDialogVisible] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);
  const { userManagement, loading, totalCount, editStateSuccess } = useSelector(
    (state: RootState) => state.userManagement
  );
  const TAB_KEY = "UM_ACTIVE_TABS";

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [activeFilters, setActiveFilters] = useState<FilterValues | null>(
    () => {
      const saved = sessionStorage.getItem("userManagementFilters");
      return saved ? JSON.parse(saved) : null;
    }
  );
  const menuRight = useRef<Menu>(null);
  const [menuUser, setMenuUser] = useState<any>(null);

  const menuItems = useMemo(
    () => [
      {
        label: "Edit",
        command: () => {
          if (menuUser)
            handlePageChange(`user-overview/${menuUser.employeeId}`);
        },
        visible: menuUser,
      },
      {
        label: "Revoke Invitation",
        command: () => {
          if (menuUser) {
            setUserTarget({ employeeId: menuUser.employeeId });
            setRevokeDialogVisible(true);
          }
        },
        visible: menuUser && menuUser.userStatus?.value === 1,
      },
      {
        label: "Resend Invitation",
        command: () => {
          if (menuUser) {
            setUserTarget({ employeeId: menuUser.employeeId });
            setResendDialogVisible(true);
          }
        },
        visible:
          menuUser &&
          (menuUser.userStatus?.value === 4 ||
            menuUser.userStatus?.value === 5),
      },
    ],
    [menuUser]
  );

  useEffect(() => {
    return () => {
      const nextPath = window.location.pathname;
      if (
        !nextPath.includes("user-management") &&
        !nextPath.includes("user-overview")
      ) {
        sessionStorage.removeItem("userManagementFilters");
      }
    };
  }, [location]);

  useEffect(() => {
    if (activeFilters) {
      sessionStorage.setItem(
        "userManagementFilters",
        JSON.stringify(activeFilters)
      );
    } else {
      sessionStorage.removeItem("userManagementFilters");
    }
  }, [activeFilters]);

  useEffect(() => {
    const tabId = Date.now();
    const tabs = JSON.parse(localStorage.getItem(TAB_KEY) || "[]");
    tabs.push(tabId);
    localStorage.setItem(TAB_KEY, JSON.stringify(tabs));

    const handleUnload = () => {
      const navEntry = performance.getEntriesByType("navigation")[0] as any;
      const isReload = navEntry?.type === "reload";
      const currentTabs = JSON.parse(localStorage.getItem(TAB_KEY) || "[]");
      const updatedTabs = currentTabs.filter((id: number) => id !== tabId);

      if (isReload) {
        sessionStorage.removeItem("userManagementFilters");
      }

      if (!isReload && updatedTabs.length === 0) {
        sessionStorage.removeItem("userManagementFilters");
        localStorage.removeItem(TAB_KEY);
      } else {
        localStorage.setItem(TAB_KEY, JSON.stringify(updatedTabs));
      }
    };

    window.addEventListener("unload", handleUnload);
    return () => window.removeEventListener("unload", handleUnload);
  }, []);

  const isAnyFilterActive = useMemo(() => {
    if (!activeFilters) return false;
    return (
      activeFilters.department.length > 0 ||
      activeFilters.roles.length > 0 ||
      activeFilters.statuses.length > 0
    );
  }, [activeFilters]);

  const fetchGridData = () => {
    const pageNumber = Math.floor(first / rows) + 1;

    if (!isAnyFilterActive) {
      if (searchTerm) {
        dispatch(
          searchUserManagementRequest({
            pageNumber,
            pageSize: rows,
            searchTerm,
          })
        );
      } else {
        dispatch(fetchUserManagementRequest({ pageNumber, pageSize: rows }));
      }
    }
  };

  const fetchFullDataForFilter = () => {
    if (totalCount && totalCount > 0) {
      dispatch(
        fetchUserManagementRequest({ pageNumber: 1, pageSize: totalCount })
      );
      isFilterDataFetched.current = true;
    }
  };

  const handleFilterOpen = () => {
    setIsFilterOpen(true);
    if (masterFilterOptions.length < (totalCount || 0)) {
      fetchFullDataForFilter();
    }
  };

  useEffect(() => {
    fetchGridData();
  }, [first, rows, isAnyFilterActive]);

  useEffect(() => {
    if (editStateSuccess) {
      if (masterFilterOptions.length > 0 || isAnyFilterActive) {
        fetchFullDataForFilter();
      } else {
        fetchGridData();
      }
    }
  }, [editStateSuccess]);

  useEffect(() => {
    if (isAnyFilterActive && !isFilterDataFetched.current && totalCount) {
      fetchFullDataForFilter();
    }
  }, [totalCount, isAnyFilterActive]);

  useEffect(() => {
    // When search is cleared but filters are active,
    // refetch full data so filters work on full dataset
    if (!searchTerm && isAnyFilterActive && totalCount) {
      isFilterDataFetched.current = false;
      fetchFullDataForFilter();
    }
  }, [searchTerm, isAnyFilterActive, totalCount]);

  // FIXED: Now updates master options even during search if editStateSuccess is true
  useEffect(() => {
    if (userManagement && Array.isArray(userManagement)) {
      const isFullFetch =
        userManagement.length >= (totalCount || 0) && totalCount !== 0;

      if (
        (!searchTerm || editStateSuccess) &&
        (isFullFetch || masterFilterOptions.length === 0)
      ) {
        setMasterFilterOptions(userManagement);
      }
    }
  }, [userManagement, totalCount, searchTerm, editStateSuccess]);

  const availableStatuses = useMemo(() => {
    const statuses = masterFilterOptions
      .map((u) => u.userStatus)
      .filter((s) => s && s.label);
    const uniqueMap = new Map();
    statuses.forEach((s) => uniqueMap.set(s.value, s));
    return Array.from(uniqueMap.values()).map((s: any) => ({
      id: s.value,
      label: s.label,
    }));
  }, [masterFilterOptions]);

  const uniqueDepartments = useMemo(() => {
    const deps = masterFilterOptions.map((u) => u.department).filter(Boolean);
    const uniqueMap = new Map();
    deps.forEach((d) => uniqueMap.set(d.value, d));
    return Array.from(uniqueMap.values()).map((d: any) => ({
      id: d.value,
      label: d.label,
    }));
  }, [masterFilterOptions]);

  const uniqueRoles = useMemo(() => {
    const roles = masterFilterOptions
      .flatMap((u) => u.roles || [])
      .filter(Boolean);
    const uniqueMap = new Map();
    roles.forEach((r) => uniqueMap.set(r.value, r));
    return Array.from(uniqueMap.values()).map((r: any) => ({
      id: r.value,
      label: r.label,
    }));
  }, [masterFilterOptions]);

  const filteredResult = useMemo(() => {
    if (!isAnyFilterActive) return [];

    let data = masterFilterOptions;

    data = data.filter((u: any) => {
      const depMatch =
        activeFilters!.department.length === 0 ||
        (u.department &&
          activeFilters!.department.includes(u.department.value));
      const roleMatch =
        activeFilters!.roles.length === 0 ||
        u.roles?.some((r: any) => activeFilters!.roles.includes(r.value));
      const statMatch =
        activeFilters!.statuses.length === 0 ||
        (u.userStatus && activeFilters!.statuses.includes(u.userStatus.value));
      return depMatch && roleMatch && statMatch;
    });

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      data = data.filter(
        (u: any) =>
          u.employeeName?.toLowerCase().includes(lowerSearch) ||
          u.emailId?.toLowerCase().includes(lowerSearch)
      );
    }

    return data;
  }, [masterFilterOptions, activeFilters, isAnyFilterActive, searchTerm]);

  const displayData = useMemo(() => {
    if (isAnyFilterActive) {
      return filteredResult.slice(first, first + rows);
    }
    if (userManagement && userManagement.length > rows) {
      return userManagement.slice(first, first + rows);
    }
    return (userManagement || []).slice(0, rows);
  }, [userManagement, filteredResult, isAnyFilterActive, first, rows]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const delay = setTimeout(() => {
      setFirst(0);
      fetchGridData();
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const onPageChange = (e: any) => {
    setFirst(e.first);
    setRows(e.rows);
  };

  const handlePageChange = (page: string) => navigate(page);

  return (
    <div className="relative w-full h-full bg-[#F6F6F6]">
      {loading && <AtsLoader />}

      <CustomConfirmDialog
        title="Revoke Invitation"
        subTitle="Are you sure you want to revoke this invitation ?"
        icon={InfoSvg}
        visible={revokeDialogVisible}
        onHide={() => setRevokeDialogVisible(false)}
        onConfirm={() => {
          if (userTarget) {
            dispatch(
              addUserRevokeRequest({ employeeId: userTarget.employeeId })
            );
            setRevokeDialogVisible(false);
          }
        }}
      />

      <CustomConfirmDialog
        title="Resend Invitation"
        subTitle="Are you sure you want to resend this invitation ?"
        icon={InfoSvg}
        visible={resendDialogVisible}
        onHide={() => setResendDialogVisible(false)}
        onConfirm={() => {
          if (userTarget) {
            dispatch(
              addUserResendRequest({ employeeId: userTarget.employeeId })
            );
            setResendDialogVisible(false);
          }
        }}
      />

      <div className="min-w-[1024px]">
        <MainPageHeader
          title={"User Management"}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onCreate={() => handlePageChange("create-user")}
          onFilterOpen={handleFilterOpen}
        />
        <UserFilterDrawer
          open={isFilterOpen}
          initialValues={activeFilters}
          onClose={() => setIsFilterOpen(false)}
          onApply={(filters) => {
            setActiveFilters(filters);
            setFirst(0);
          }}
          onReset={() => {
            setActiveFilters(null);
            setFirst(0);
            sessionStorage.removeItem("userManagementFilters");
            setIsFilterOpen(false);
            if (searchTerm) {
              dispatch(
                searchUserManagementRequest({
                  pageNumber: 1,
                  pageSize: rows,
                  searchTerm,
                })
              );
            } else {
              dispatch(
                fetchUserManagementRequest({ pageNumber: 1, pageSize: rows })
              );
            }
          }}
          departments={uniqueDepartments}
          roles={uniqueRoles}
          statuses={availableStatuses}
        />
      </div>

      <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 items-center bg-[#F6F6F6] px-8 py-4 rounded-t-[24px] relative z-20 -mt-[60px] min-w-0">
        <span className="font-medium">Employee Name</span>
        <span className="font-medium">Email ID</span>
        <span className="font-medium">Department</span>
        <span className="font-medium">Roles</span>
        <span className="font-medium">Status</span>
      </div>

      <div
        style={{ height: "calc(100vh - 208px)", overflowY: "auto" }}
        className="border border-[#EFEFEF] rounded-b-[10px] bg-[#F6F6F6] relative z-10"
        onScroll={(e) => menuRight.current?.hide(e)}
      >
        <div className="grid grid-cols-1 gap-2 p-5">
          {displayData.length > 0
            ? displayData.map((userItem: any) => (
                <div
                  key={userItem.employeeId}
                  className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] items-center bg-white rounded-l-[10px] shadow-md min-h-16"
                >
                  <div className="px-4 py-3 border-r border-[#EFEFEF] truncate font-semibold">
                    {userItem?.employeeName}
                  </div>
                  <div className="px-4 py-3 border-r border-[#EFEFEF] truncate">
                    {userItem.emailId}
                  </div>
                  <div className="px-4 py-3 border-r border-[#EFEFEF] truncate">
                    {userItem?.department?.label}
                  </div>
                  <div className="px-4 py-3 border-r border-[#EFEFEF] truncate">
                    {userItem.roles?.map((r: any) => r.label).join(", ")}
                  </div>
                  <div className="px-4 py-3 border-r border-[#EFEFEF] flex items-center justify-between">
                    <span
                      className={`text-sm font-medium px-3 py-1 rounded-full ${getUserStatusClasses(
                        userItem?.userStatus?.value ?? 2
                      )}`}
                    >
                      {userItem?.userStatus?.label}
                    </span>
                    <button
                      className="p-1 rounded-full hover:bg-gray-100 menu-toggle-btn"
                      onClick={(event) => {
                        setMenuUser(userItem);
                        menuRight.current?.toggle(event);
                      }}
                    >
                      <MoreVertical size={20} className="text-gray-500" />
                    </button>
                  </div>
                </div>
              ))
            : !loading && <EmptyState />}
        </div>
      </div>

      <AtsPaginator
        first={first}
        rows={rows}
        totalCount={isAnyFilterActive ? filteredResult.length : totalCount || 0}
        onPageChange={onPageChange}
        hasDocuments={displayData.length > 0}
      />
      <Menu
        model={menuItems}
        popup
        ref={menuRight}
        id="popup_menu_right"
        appendTo={document.body}
      />
    </div>
  );
};

export default UserManagement;
