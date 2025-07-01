"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { UserService } from "@/services/userService";
import {
  User,
  UserRole,
  canManageUsers,
  canAppointAdmins,
  ADMIN_COLORS,
} from "@/types/auth";
import {
  getNavigationData,
  getManagedArea,
  getManagedAreaDisplayName,
  loadBoardList,
  type NavigationData,
} from "@/utils/boardData";
import {
  Users,
  Shield,
  Search,
  Filter,
  Edit,
  Crown,
  Coins,
  ArrowLeft,
  UserPlus,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";

const AdminUsersPage = () => {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<UserRole | "">("");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showPointModal, setShowPointModal] = useState(false);
  const [pointAmount, setPointAmount] = useState("");
  const [pointDescription, setPointDescription] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 계층적 선택을 위한 상태
  const [selectedNavigation, setSelectedNavigation] = useState<string>("");
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [selectedBoard, setSelectedBoard] = useState<string>("");
  const [boardList, setBoardList] = useState<string[]>([]);
  const [loadingBoards, setLoadingBoards] = useState(false);

  // 네비게이션 데이터
  const navigationData = getNavigationData();

  useEffect(() => {
    if (!user) {
      router.push("/admin/login");
      return;
    }

    // 권한 확인
    if (!canManageUsers(userData?.role || "MEMBER")) {
      router.push("/admin");
      return;
    }

    loadUsers();
  }, [user, userData, router]);

  const loadUsers = async () => {
    try {
      const usersData = await UserService.getUsers(100);
      setUsers(usersData);
    } catch (error) {
      console.error("Error loading users:", error);
      setMessage("Failed to load user list.");
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "OWNER":
        return "Owner";
      case "ADMIN":
        return "Administrator";
      case "NAVI_ADMIN":
        return "Navigation Admin";
      case "CHANNEL_ADMIN":
        return "Channel Admin";
      case "BOARD_ADMIN":
        return "Board Admin";
      case "MEMBER":
        return "Member";
      default:
        return role;
    }
  };

  const getUserLevel = (points: number, isHonorary: boolean = false) => {
    if (isHonorary) {
      return { level: "감사멤버", icon: "🍃", color: "#228B22" };
    }
    if (points >= 200)
      return { level: "최고멤버", icon: "👑", color: "#FFD700" };
    if (points >= 100)
      return { level: "우수멤버", icon: "👑", color: "#FFD700" };
    if (points >= 60)
      return { level: "열심멤버", icon: "👑", color: "#C0C0C0" };
    if (points >= 30)
      return { level: "성실멤버", icon: "👑", color: "#FFD700" };
    if (points >= 5) return { level: "일반멤버", icon: "👑", color: "#808080" };
    return { level: "새싹멤버", icon: "🌱", color: "#8B4513" };
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // 권한 변경 모달 열기
  const openRoleChangeModal = (userItem: User) => {
    console.log("Opening role change modal for user:", userItem);
    setSelectedUser(userItem);
    setNewRole(""); // 빈 문자열로 초기화하여 권한 선택을 강제하도록 함
    setSelectedNavigation("");
    setSelectedChannel("");
    setSelectedBoard("");
    setBoardList([]);
    setShowRoleModal(true);
  };

  // 권한 변경 저장
  const handleRoleChangeSave = async () => {
    console.log("handleRoleChangeSave called", {
      selectedUser,
      newRole,
      user,
      selectedNavigation,
      selectedChannel,
      selectedBoard,
    });

    if (!selectedUser || !newRole || !user) {
      console.log("Early return: missing required data");
      return;
    }

    // 소유자가 아닌데 소유자 권한을 주려고 하는지 확인
    if (newRole === "OWNER" && userData?.role !== "OWNER") {
      setMessage("Only owners can assign owner role.");
      return;
    }

    // 소유자가 자기 권한을 낮추려고 하는지 확인
    if (
      selectedUser.uid === user.uid &&
      userData?.role === "OWNER" &&
      newRole !== "OWNER"
    ) {
      setMessage("Owners cannot downgrade their own role.");
      return;
    }

    // 권한별 필수 선택 확인
    if (newRole === "NAVI_ADMIN" && !selectedNavigation) {
      console.log("NAVI_ADMIN validation failed: no navigation selected");
      setMessage("Please select a navigation to manage.");
      return;
    }

    if (
      newRole === "CHANNEL_ADMIN" &&
      (!selectedNavigation || !selectedChannel)
    ) {
      console.log(
        "CHANNEL_ADMIN validation failed: missing navigation or channel"
      );
      setMessage("Please select both navigation and channel to manage.");
      return;
    }

    if (
      newRole === "BOARD_ADMIN" &&
      (!selectedNavigation || !selectedChannel || !selectedBoard)
    ) {
      console.log(
        "BOARD_ADMIN validation failed: missing navigation, channel, or board"
      );
      setMessage("Please select navigation, channel, and board to manage.");
      return;
    }

    setActionLoading(true);
    try {
      // 권한에 따른 관리 영역 설정
      let managedAreas: string[] = [];

      switch (newRole) {
        case "NAVI_ADMIN":
          managedAreas = [selectedNavigation];
          break;
        case "CHANNEL_ADMIN":
          managedAreas = [getManagedArea(selectedNavigation, selectedChannel)];
          break;
        case "BOARD_ADMIN":
          managedAreas = [
            getManagedArea(selectedNavigation, selectedChannel, selectedBoard),
          ];
          break;
        default:
          managedAreas = [];
      }

      await UserService.changeUserRole(
        user.uid,
        selectedUser.uid,
        newRole,
        managedAreas
      );
      setMessage("Role has been changed successfully.");
      setShowRoleModal(false);
      setSelectedUser(null);
      setNewRole("");
      setSelectedNavigation("");
      setSelectedChannel("");
      setSelectedBoard("");
      loadUsers(); // 목록 새로고침
    } catch (error) {
      console.error("Failed to change role:", error);
      setMessage("Failed to change role.");
    } finally {
      setActionLoading(false);
    }
  };

  // 권한 변경 취소
  const handleRoleChangeCancel = () => {
    setShowRoleModal(false);
    setSelectedUser(null);
    setNewRole("");
    setSelectedNavigation("");
    setSelectedChannel("");
    setSelectedBoard("");
  };

  // 선택된 네비게이션의 채널 목록
  const selectedNavData = navigationData.find(
    (nav) => nav.path === selectedNavigation
  );

  // 선택된 채널의 게시판 목록
  const selectedChannelData = selectedNavData?.channels.find(
    (channel) => channel.path === selectedChannel
  );

  // 채널이 선택되면 해당 채널의 게시판 목록을 동적으로 불러오기
  useEffect(() => {
    if (selectedNavigation && selectedChannel && newRole === "BOARD_ADMIN") {
      setLoadingBoards(true);
      loadBoardList(selectedNavigation, selectedChannel)
        .then((boards) => {
          setBoardList(boards);
        })
        .catch((error) => {
          console.error("Failed to load board list:", error);
          setBoardList([]);
        })
        .finally(() => {
          setLoadingBoards(false);
        });
    } else {
      setBoardList([]);
    }
  }, [selectedNavigation, selectedChannel, newRole]);

  // 권한 변경 모달
  const RoleChangeModal = () => {
    if (!selectedUser || !showRoleModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Change User Role</h2>
            <button
              onClick={handleRoleChangeCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* 사용자 정보 */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium">
                User: {selectedUser.nickname}
              </p>
              <p className="text-sm text-gray-600">
                Email: {selectedUser.email}
              </p>
              <p className="text-sm text-gray-600">
                Current Role: {getRoleDisplayName(selectedUser.role)}
              </p>
            </div>

            {/* 권한 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Role
              </label>
              <select
                value={newRole}
                onChange={(e) => {
                  const role = e.target.value as UserRole;
                  console.log("Role changed to:", role);
                  setNewRole(role);
                  setSelectedNavigation("");
                  setSelectedChannel("");
                  setSelectedBoard("");
                  setBoardList([]);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Role</option>
                {userData?.role === "OWNER" && (
                  <option value="OWNER">Owner</option>
                )}
                {(userData?.role === "OWNER" || userData?.role === "ADMIN") && (
                  <option value="ADMIN">Administrator</option>
                )}
                {(userData?.role === "OWNER" ||
                  userData?.role === "ADMIN" ||
                  userData?.role === "NAVI_ADMIN") && (
                  <option value="NAVI_ADMIN">Navigation Admin</option>
                )}
                {(userData?.role === "OWNER" ||
                  userData?.role === "ADMIN" ||
                  userData?.role === "NAVI_ADMIN" ||
                  userData?.role === "CHANNEL_ADMIN") && (
                  <option value="CHANNEL_ADMIN">Channel Admin</option>
                )}
                {(userData?.role === "OWNER" ||
                  userData?.role === "ADMIN" ||
                  userData?.role === "NAVI_ADMIN" ||
                  userData?.role === "CHANNEL_ADMIN" ||
                  userData?.role === "BOARD_ADMIN") && (
                  <option value="BOARD_ADMIN">Board Admin</option>
                )}
                <option value="MEMBER">Member</option>
              </select>
            </div>

            {/* 계층적 선택 UI */}
            {newRole &&
              newRole !== "MEMBER" &&
              newRole !== "ADMIN" &&
              newRole !== "OWNER" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Select Management Areas
                  </h3>

                  {/* Navigation Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Navigation{" "}
                      {newRole === "NAVI_ADMIN" ? "(Required)" : "(Step 1)"}
                    </label>
                    <select
                      value={selectedNavigation}
                      onChange={(e) => {
                        const nav = e.target.value;
                        console.log("Navigation changed to:", nav);
                        setSelectedNavigation(nav);
                        setSelectedChannel("");
                        setSelectedBoard("");
                        setBoardList([]);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Navigation</option>
                      {navigationData.map((nav) => (
                        <option key={nav.path} value={nav.path}>
                          {nav.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Channel Selection */}
                  {(newRole === "CHANNEL_ADMIN" || newRole === "BOARD_ADMIN") &&
                    selectedNavigation && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Channel{" "}
                          {newRole === "CHANNEL_ADMIN"
                            ? "(Required)"
                            : "(Step 2)"}
                        </label>
                        <select
                          value={selectedChannel}
                          onChange={(e) => {
                            const channel = e.target.value;
                            console.log("Channel changed to:", channel);
                            setSelectedChannel(channel);
                            setSelectedBoard("");
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Channel</option>
                          {selectedNavData?.channels.map((channel) => (
                            <option key={channel.path} value={channel.path}>
                              {channel.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                  {/* Board Selection */}
                  {newRole === "BOARD_ADMIN" &&
                    selectedNavigation &&
                    selectedChannel && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Board (Required)
                        </label>
                        <select
                          value={selectedBoard}
                          onChange={(e) => setSelectedBoard(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={loadingBoards}
                        >
                          <option value="">
                            {loadingBoards
                              ? "Loading boards..."
                              : "Select Board"}
                          </option>
                          {boardList.map((board) => (
                            <option key={board} value={board}>
                              {board
                                .replace(/-/g, " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                  {/* Selected Areas Preview */}
                  {(selectedNavigation || selectedChannel || selectedBoard) && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-800 mb-2">
                        Selected Management Areas:
                      </h4>
                      <div className="text-sm text-blue-700 space-y-1">
                        {selectedNavigation && (
                          <div className="flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            Navigation:{" "}
                            {
                              navigationData.find(
                                (nav) => nav.path === selectedNavigation
                              )?.name
                            }
                          </div>
                        )}
                        {selectedChannel && (
                          <div className="flex items-center ml-4">
                            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                            Channel:{" "}
                            {
                              selectedNavData?.channels.find(
                                (channel) => channel.path === selectedChannel
                              )?.name
                            }
                          </div>
                        )}
                        {selectedBoard && (
                          <div className="flex items-center ml-8">
                            <span className="w-2 h-2 bg-blue-300 rounded-full mr-2"></span>
                            Board: {selectedBoard}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

            {/* 경고 메시지 */}
            {newRole === "OWNER" && userData?.role !== "OWNER" && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  ⚠️ Only owners can assign owner role.
                </p>
              </div>
            )}

            {/* 버튼 */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={handleRoleChangeCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleRoleChangeSave}
                disabled={
                  actionLoading ||
                  !newRole ||
                  (newRole === "NAVI_ADMIN" && !selectedNavigation) ||
                  (newRole === "CHANNEL_ADMIN" &&
                    (!selectedNavigation || !selectedChannel)) ||
                  (newRole === "BOARD_ADMIN" &&
                    (!selectedNavigation || !selectedChannel || !selectedBoard))
                }
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {actionLoading ? "Saving..." : "Save Changes"}
              </button>

              {/* 디버깅용 상태 표시 */}
              <div className="text-xs text-gray-500 mt-2">
                상태: newRole={newRole || "선택안됨"}, nav=
                {selectedNavigation || "선택안됨"}, channel=
                {selectedChannel || "선택안됨"}, board=
                {selectedBoard || "선택안됨"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handlePointModification = async () => {
    if (!selectedUser || !pointAmount || !pointDescription) {
      setMessage("Please fill in all fields.");
      return;
    }

    setActionLoading(true);
    try {
      const amount = parseFloat(pointAmount);
      if (isNaN(amount)) {
        setMessage("Please enter a valid point amount.");
        return;
      }

      await UserService.adminModifyPoints(
        user!.uid,
        selectedUser.uid,
        amount,
        pointDescription
      );

      setMessage("Points have been modified successfully.");
      setShowPointModal(false);
      setPointAmount("");
      setPointDescription("");
      loadUsers(); // 목록 새로고침
    } catch (error) {
      console.error("Failed to modify points:", error);
      setMessage("Failed to modify points.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleHonorary = async (
    userId: string,
    currentStatus: boolean
  ) => {
    if (!user) return;

    setActionLoading(true);
    try {
      await UserService.toggleHonoraryMember(user.uid, userId, !currentStatus);
      setMessage("Honorary member status has been changed.");
      loadUsers();
    } catch (error) {
      console.error("Failed to toggle honorary status:", error);
      setMessage("Failed to change honorary member status.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push("/admin")}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <Users className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                User Management
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by nickname or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value as UserRole | "ALL")
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">All Roles</option>
                <option value="OWNER">Owner</option>
                <option value="ADMIN">Admin</option>
                <option value="NAVI_ADMIN">Navigation Admin</option>
                <option value="CHANNEL_ADMIN">Channel Admin</option>
                <option value="BOARD_ADMIN">Board Admin</option>
                <option value="MEMBER">Member</option>
              </select>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">{message}</p>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Managed Areas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points/Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((userItem) => {
                  const userLevel = getUserLevel(
                    userItem.points,
                    userItem.isHonoraryMember
                  );
                  const adminColor = ADMIN_COLORS[userItem.role];

                  return (
                    <tr key={userItem.uid} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {userItem.nickname.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {userItem.nickname}
                            </div>
                            <div className="text-sm text-gray-500">
                              {userItem.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Shield size={16} style={{ color: adminColor }} />
                          <span className="text-sm text-gray-900">
                            {getRoleDisplayName(userItem.role)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {userItem.managedAreas &&
                          userItem.managedAreas.length > 0 ? (
                            <div className="space-y-1">
                              {userItem.managedAreas
                                .slice(0, 2)
                                .map((area, index) => (
                                  <div
                                    key={index}
                                    className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded"
                                  >
                                    {getManagedAreaDisplayName(
                                      area,
                                      navigationData
                                    )}
                                  </div>
                                ))}
                              {userItem.managedAreas.length > 2 && (
                                <div className="text-xs text-gray-500">
                                  +{userItem.managedAreas.length - 2} more
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Coins size={16} className="text-yellow-600" />
                          <span className="text-sm font-medium text-gray-900">
                            {userItem.points.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {userLevel.icon} {userLevel.level}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {userItem.createdAt.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openRoleChangeModal(userItem)}
                            className="text-blue-600 hover:text-blue-900"
                            disabled={actionLoading}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(userItem);
                              setShowPointModal(true);
                            }}
                            className="text-green-600 hover:text-green-900"
                            disabled={actionLoading}
                          >
                            <Coins size={16} />
                          </button>
                          <button
                            onClick={() =>
                              handleToggleHonorary(
                                userItem.uid,
                                userItem.isHonoraryMember
                              )
                            }
                            className={`${
                              userItem.isHonoraryMember
                                ? "text-red-600 hover:text-red-900"
                                : "text-green-600 hover:text-green-900"
                            }`}
                            disabled={actionLoading}
                          >
                            {userItem.isHonoraryMember ? (
                              <EyeOff size={16} />
                            ) : (
                              <Crown size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Count */}
        <div className="mt-4 text-sm text-gray-600">
          Total {filteredUsers.length} users
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">User Details</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nickname
                </label>
                <p className="text-sm text-gray-900">{selectedUser.nickname}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-sm text-gray-900">{selectedUser.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Role
                </label>
                <div className="flex items-center space-x-2">
                  <Shield
                    size={16}
                    style={{ color: ADMIN_COLORS[selectedUser.role] }}
                  />
                  <span className="text-sm text-gray-900">
                    {getRoleDisplayName(selectedUser.role)}
                  </span>
                </div>
              </div>

              {/* 관리 영역 표시 */}
              {selectedUser.managedAreas &&
                selectedUser.managedAreas.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Managed Areas
                    </label>
                    <div className="space-y-1">
                      {selectedUser.managedAreas.map((area, index) => (
                        <div
                          key={index}
                          className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded"
                        >
                          {getManagedAreaDisplayName(area, navigationData)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points
                </label>
                <p className="text-sm text-gray-900">
                  {selectedUser.points.toFixed(2)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Join Date
                </label>
                <p className="text-sm text-gray-900">
                  {selectedUser.createdAt.toLocaleDateString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Login
                </label>
                <p className="text-sm text-gray-900">
                  {selectedUser.lastLoginAt.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Point Modification Modal */}
      {showPointModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Point Modification</h2>
              <button
                onClick={() => setShowPointModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User
                </label>
                <p className="text-sm text-gray-900">{selectedUser.nickname}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Points
                </label>
                <p className="text-sm text-gray-900">
                  {selectedUser.points.toFixed(2)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Point Adjustment (+/-)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={pointAmount}
                  onChange={(e) => setPointAmount(e.target.value)}
                  placeholder="e.g., 10 or -5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <input
                  type="text"
                  value={pointDescription}
                  onChange={(e) => setPointDescription(e.target.value)}
                  placeholder="Enter reason for point adjustment"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowPointModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePointModification}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={actionLoading}
                >
                  {actionLoading ? "Processing..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Change Modal */}
      {RoleChangeModal()}
    </div>
  );
};

export default AdminUsersPage;
