import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import Lucide from "@/components/Base/Lucide";
import { Menu } from "@/components/Base/Headless";
import Pagination from "@/components/Base/Pagination";
import { FormCheck, FormInput, FormSelect } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import Table from "@/components/Base/Table";
import UserDetailsModal from "./UserDetailsModal";
import UserFormModal from "./UserFormModal";
import { AdminUsecasesController } from "@/controllers";
import { UserRole } from "@/services/AdminService";
import { useStore } from "@/state/MobxStoreProvider";
import clsx from "clsx";

// Helper function to get role string from UserRole enum
const getRoleString = (role: UserRole): string => {
  switch (role) {
    case UserRole.Admin:
      return "Admin";
    case UserRole.Teacher:
      return "Teacher";
    case UserRole.Student:
      return "Student";
    default:
      return "Unknown";
  }
};

const UserManagementTab: React.FC = observer(() => {
  const { adminUsecasesStore } = useStore();
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");

  // Set up to listen for the openCreateUserModal flag to show the create user modal
  useEffect(() => {
    if (adminUsecasesStore.openCreateUserModal) {
      setShowUserForm(true);
      adminUsecasesStore.openCreateUserModal = false; // Reset the flag
    }
  }, [adminUsecasesStore.openCreateUserModal]);

  // Handle user selection
  const handleUserSelect = async (userId: string) => {
    try {
      await adminUsecasesStore.fetchUser(userId);
      setShowUserDetails(true);
    } catch (error) {
      console.error("Failed to load user details:", error);
    }
  };

  // Handle create new user
  const handleCreateUser = () => {
    adminUsecasesStore.selectedUser = null;
    setShowUserForm(true);
  };

  // Handle delete user
  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await adminUsecasesStore.deleteUser(userId);
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  // Filter users by search term and role
  const filteredUsers = adminUsecasesStore.users
    .filter(user => 
      (roleFilter === "all" || user.role === roleFilter) &&
      (user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
        <div className="text-base font-medium group-[.mode--light]:text-white">
          User Management
        </div>
        <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 md:ml-auto">
          <Button
            variant="primary"
            onClick={handleCreateUser}
          >
            <Lucide icon="UserPlus" className="w-4 h-4 mr-2" />
            Add New User
          </Button>
        </div>
      </div>
      
      {/* Users Table */}
      <div className="flex flex-col box box--stacked">
        <div className="flex flex-col p-5 sm:items-center sm:flex-row gap-y-2">
          <div className="flex gap-2">
            <div className="relative">
              <Lucide
                icon="Search"
                className="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-3 stroke-[1.3] text-slate-500"
              />
              <FormInput
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 sm:w-64 rounded-[0.5rem]"
              />
            </div>
            <FormSelect
              value={roleFilter === "all" ? "all" : roleFilter.toString()}
              onChange={(e) => {
                const value = e.target.value;
                setRoleFilter(value === "all" ? "all" : parseInt(value) as UserRole);
                setCurrentPage(1);
              }}
              className="w-32 rounded-[0.5rem]"
            >
              <option value="all">All Roles</option>
              <option value={UserRole.Admin}>Admin</option>
              <option value={UserRole.Teacher}>Teacher</option>
              <option value={UserRole.Student}>Student</option>
            </FormSelect>
          </div>
          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 sm:ml-auto">
            <Button
              variant="outline-secondary"
              onClick={() => {
                setSearchTerm("");
                setRoleFilter("all");
                adminUsecasesStore.fetchAllUsers();
              }}
            >
              <Lucide icon="RefreshCw" className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {adminUsecasesStore.loading ? (
          // Shimmer loading effect for table
          <div className="overflow-auto xl:overflow-visible">
            <div className="min-w-full">
              <div className="border-b border-slate-200/60 bg-slate-50 p-4">
                <div className="grid grid-cols-5 gap-4">
                  <div className="h-5 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-5 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-5 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-5 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-5 bg-slate-200 rounded animate-pulse"></div>
                </div>
              </div>
              {[...Array(5)].map((_, index) => (
                <div key={index} className="border-b border-slate-200/60 p-4">
                  <div className="grid grid-cols-5 gap-4">
                    <div className="h-5 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-5 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-5 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-5 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-5 bg-slate-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-auto xl:overflow-visible">
            <Table className="border-b border-slate-200/60">
              <Table.Thead>
                <Table.Tr>
                  <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                    <FormCheck.Input type="checkbox" />
                  </Table.Td>
                  <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                    User
                  </Table.Td>
                  <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                    Email
                  </Table.Td>
                  <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                    Role
                  </Table.Td>
                  <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                    Created
                  </Table.Td>
                  <Table.Td className="w-20 py-4 font-medium text-center border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                    Action
                  </Table.Td>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <Table.Tr key={user.id} className="[&_td]:last:border-b-0">
                      <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                        <FormCheck.Input type="checkbox" />
                      </Table.Td>
                      <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                        <div className="flex items-center">
                          <div className="w-9 h-9 image-fit zoom-in rounded-full overflow-hidden bg-primary/20 flex items-center justify-center">
                            <Lucide
                              icon={
                                user.role === UserRole.Admin
                                  ? "Shield"
                                  : user.role === UserRole.Teacher
                                  ? "GraduationCap"
                                  : "User"
                              }
                              className={`w-5 h-5 ${
                                user.role === UserRole.Admin
                                  ? "text-danger"
                                  : user.role === UserRole.Teacher
                                  ? "text-success"
                                  : "text-primary"
                              }`}
                            />
                          </div>
                          <div className="ml-3.5">
                            <a
                              href="#"
                              className="font-medium whitespace-nowrap"
                              onClick={(e) => {
                                e.preventDefault();
                                handleUserSelect(user.id);
                              }}
                            >
                              {user.displayName}
                            </a>
                            <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                              ID: {user.id.substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </Table.Td>
                      <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                        <div className="font-medium whitespace-nowrap">
                          {user.email}
                        </div>
                      </Table.Td>
                      <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                        <div
                          className={clsx([
                            "flex items-center justify-center w-fit px-2 py-0.5 rounded",
                            user.role === UserRole.Admin
                              ? "bg-danger/20 text-danger"
                              : user.role === UserRole.Teacher
                              ? "bg-success/20 text-success"
                              : "bg-primary/20 text-primary",
                          ])}
                        >
                          <Lucide
                            icon={
                              user.role === UserRole.Admin
                                ? "Shield"
                                : user.role === UserRole.Teacher
                                ? "GraduationCap"
                                : "User"
                            }
                            className="w-3.5 h-3.5 mr-1"
                          />
                          <div className="whitespace-nowrap">
                            {getRoleString(user.role)}
                          </div>
                        </div>
                      </Table.Td>
                      <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                        <div className="font-medium whitespace-nowrap">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </Table.Td>
                      <Table.Td className="relative py-4 border-dashed dark:bg-darkmode-600">
                        <div className="flex items-center justify-center">
                          <Menu className="h-5">
                            <Menu.Button className="w-5 h-5 text-slate-500">
                              <Lucide
                                icon="MoreVertical"
                                className="w-5 h-5 stroke-slate-400/70 fill-slate-400/70"
                              />
                            </Menu.Button>
                            <Menu.Items className="w-40">
                              <Menu.Item onClick={() => handleUserSelect(user.id)}>
                                <Lucide
                                  icon="Eye"
                                  className="w-4 h-4 mr-2"
                                />{" "}
                                View Details
                              </Menu.Item>
                              <Menu.Item onClick={() => {
                                // Cycle through roles: Admin -> Student -> Teacher -> Admin
                                const newRole = user.role === UserRole.Admin 
                                  ? UserRole.Student 
                                  : user.role === UserRole.Teacher 
                                    ? UserRole.Admin 
                                    : UserRole.Teacher;
                                    
                                adminUsecasesStore.updateUserRole(user.id, {
                                  role: newRole
                                });
                              }}>
                                <Lucide
                                  icon="RefreshCw"
                                  className="w-4 h-4 mr-2"
                                />{" "}
                                Change Role
                              </Menu.Item>
                              <Menu.Item onClick={() => handleDeleteUser(user.id)}>
                                <Lucide
                                  icon="Trash2"
                                  className="w-4 h-4 mr-2"
                                />{" "}
                                Delete User
                              </Menu.Item>
                            </Menu.Items>
                          </Menu>
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  ))
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={6} className="text-center py-4">
                      <div className="flex flex-col items-center justify-center py-4">
                        <Lucide
                          icon="Search"
                          className="w-16 h-16 text-slate-300"
                        />
                        <div className="mt-2 text-slate-500">
                          {searchTerm || roleFilter !== "all" 
                            ? "No users match your search criteria" 
                            : "No users found"}
                        </div>
                        <Button
                          variant="outline-primary"
                          className="mt-4"
                          onClick={handleCreateUser}
                        >
                          <Lucide icon="UserPlus" className="w-4 h-4 mr-2" />
                          Add New User
                        </Button>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {!adminUsecasesStore.loading && filteredUsers.length > 0 && (
          <div className="flex flex-col-reverse flex-wrap items-center p-5 flex-reverse gap-y-2 sm:flex-row">
            <Pagination className="flex-1 w-full mr-auto sm:w-auto">
              <Pagination.Link onClick={() => currentPage > 1 && setCurrentPage(1)}>
                <Lucide icon="ChevronsLeft" className="w-4 h-4" />
              </Pagination.Link>
              <Pagination.Link onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}>
                <Lucide icon="ChevronLeft" className="w-4 h-4" />
              </Pagination.Link>
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <Pagination.Link
                      key={pageNumber}
                      active={currentPage === pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </Pagination.Link>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return <Pagination.Link key={pageNumber}>...</Pagination.Link>;
                }
                return null;
              })}
              <Pagination.Link onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}>
                <Lucide icon="ChevronRight" className="w-4 h-4" />
              </Pagination.Link>
              <Pagination.Link onClick={() => currentPage < totalPages && setCurrentPage(totalPages)}>
                <Lucide icon="ChevronsRight" className="w-4 h-4" />
              </Pagination.Link>
            </Pagination>
            <FormSelect
              className="sm:w-20 rounded-[0.5rem]"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </FormSelect>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {adminUsecasesStore.selectedUser && (
        <UserDetailsModal
          open={showUserDetails}
          onClose={() => setShowUserDetails(false)}
          user={adminUsecasesStore.selectedUser}
          onDelete={handleDeleteUser}
        />
      )}

      {/* User Form Modal */}
      <UserFormModal
        open={showUserForm}
        onClose={() => setShowUserForm(false)}
        onSuccess={() => {
          setShowUserForm(false);
          adminUsecasesStore.fetchAllUsers();
        }}
      />
    </div>
  );
});

export default UserManagementTab;
