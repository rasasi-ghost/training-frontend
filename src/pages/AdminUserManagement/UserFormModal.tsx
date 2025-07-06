import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import { FormInput, FormSelect, FormLabel, FormTextarea } from "@/components/Base/Form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AdminUsecasesController } from "@/controllers";
import { CreateUserRequest, UserRole } from "@/services/AdminService";
import clsx from "clsx";
import Notification from "@/components/Base/Notification";
import Toastify from "toastify-js";

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const schema = yup.object({
  email: yup.string().required("Email is required").email("Email must be a valid email address"),
  password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
  displayName: yup.string().required("Display name is required"),
  role: yup.number().required("Role is required"),
  isSuperAdmin: yup.boolean().when("role", (role, schema) => 
    role[0] === UserRole.Admin ? schema : schema
  ),
  department: yup.string().when("role", (role, schema) => 
    role[0] === UserRole.Teacher ? schema : schema
  ),
  qualification: yup.string().when("role", (role, schema) => 
    role[0] === UserRole.Teacher ? schema : schema
  ),
  studentId: yup.string().when("role", (role, schema) => 
    role[0] === UserRole.Student ? schema : schema
  ),
  year: yup.number().positive().integer().when("role", (role, schema) => 
    role[0] === UserRole.Student ? 
      yup.number().positive("Year must be positive").integer("Year must be an integer") : 
      schema
  ),
});

type FormData = yup.InferType<typeof schema>;

const UserFormModal: React.FC<UserFormModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      displayName: "",
      role: UserRole.Student,
      isSuperAdmin: false,
      department: "",
      qualification: "",
      studentId: "",
      year: undefined,
    },
  });

  const selectedRole = watch("role");

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const userData: CreateUserRequest = {
        email: data.email,
        password: data.password,
        displayName: data.displayName,
        role: data.role as UserRole,
      };

      if (data.role === UserRole.Admin && data.isSuperAdmin !== undefined) {
        userData.isSuperAdmin = data.isSuperAdmin;
      } else if (data.role === UserRole.Teacher) {
        userData.department = data.department;
        userData.qualification = data.qualification;
      } else if (data.role === UserRole.Student) {
        userData.studentId = data.studentId;
        userData.year = data.year;
      }

      const result = await AdminUsecasesController.createUser(userData);
      
      if (result.success) {
        const successEl = document
          .querySelectorAll("#success-notification-content")[0]
          .cloneNode(true) as HTMLElement;
        successEl.classList.remove("hidden");
        Toastify({
          node: successEl,
          duration: 3000,
          newWindow: true,
          close: true,
          gravity: "top",
          position: "right",
          stopOnFocus: true,
        }).showToast();
        
        onSuccess();
      } else {
        const failedEl = document
          .querySelectorAll("#failed-notification-content")[0]
          .cloneNode(true) as HTMLElement;
        failedEl.classList.remove("hidden");
        Toastify({
          node: failedEl,
          duration: 3000,
          newWindow: true,
          close: true,
          gravity: "top",
          position: "right",
          stopOnFocus: true,
        }).showToast();
      }
    } catch (error) {
      console.error("Failed to create user:", error);
      
      const failedEl = document
        .querySelectorAll("#failed-notification-content")[0]
        .cloneNode(true) as HTMLElement;
      failedEl.classList.remove("hidden");
      Toastify({
        node: failedEl,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
      }).showToast();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        size="lg"
      >
        <Dialog.Panel className="p-0">
          <div className="px-5 py-3 border-b border-slate-200/60">
            <div className="flex items-center">
              <div className="mr-auto text-base font-medium">Create New User</div>
              <Button
                variant="outline-secondary"
                className="hidden sm:flex"
                onClick={onClose}
              >
                <Lucide icon="X" className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-5 grid grid-cols-12 gap-4">
              <div className="col-span-12 lg:col-span-6">
                <div className="p-5 box box--stacked">
                  <div className="text-base font-medium">Basic Information</div>
                  <div className="mt-3">
                    <div className="flex flex-col gap-y-4">
                      <div>
                        <FormLabel htmlFor="email">Email *</FormLabel>
                        <FormInput
                          {...register("email")}
                          id="email"
                          type="email"
                          placeholder="user@example.com"
                          className={clsx({
                            "border-danger": errors.email,
                          })}
                        />
                        {errors.email && (
                          <div className="mt-2 text-danger text-sm">
                            {errors.email.message}
                          </div>
                        )}
                      </div>
                      <div>
                        <FormLabel htmlFor="password">Password *</FormLabel>
                        <FormInput
                          {...register("password")}
                          id="password"
                          type="password"
                          placeholder="********"
                          className={clsx({
                            "border-danger": errors.password,
                          })}
                        />
                        {errors.password && (
                          <div className="mt-2 text-danger text-sm">
                            {errors.password.message}
                          </div>
                        )}
                      </div>
                      <div>
                        <FormLabel htmlFor="displayName">Display Name *</FormLabel>
                        <FormInput
                          {...register("displayName")}
                          id="displayName"
                          type="text"
                          placeholder="John Doe"
                          className={clsx({
                            "border-danger": errors.displayName,
                          })}
                        />
                        {errors.displayName && (
                          <div className="mt-2 text-danger text-sm">
                            {errors.displayName.message}
                          </div>
                        )}
                      </div>
                      <div>
                        <FormLabel htmlFor="role">Role *</FormLabel>
                        <FormSelect
                          {...register("role")}
                          id="role"
                          className={clsx({
                            "border-danger": errors.role,
                          })}
                          onChange={(e) => {
                            setValue("role", parseInt(e.target.value) as UserRole);
                          }}
                        >
                          <option value={UserRole.Student}>Student</option>
                          <option value={UserRole.Teacher}>Teacher</option>
                          <option value={UserRole.Admin}>Administrator</option>
                        </FormSelect>
                        {errors.role && (
                          <div className="mt-2 text-danger text-sm">
                            {errors.role.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-6">
                <div className="p-5 box box--stacked">
                  <div className="text-base font-medium">Role-specific Information</div>
                  <div className="mt-3">
                    <div className="flex flex-col gap-y-4">
                      {selectedRole === UserRole.Admin && (
                        <div>
                          <FormLabel htmlFor="isSuperAdmin">Admin Type</FormLabel>
                          <FormSelect
                            {...register("isSuperAdmin")}
                            id="isSuperAdmin"
                            className={clsx({
                              "border-danger": errors.isSuperAdmin,
                            })}
                            onChange={(e) => {
                              setValue("isSuperAdmin", e.target.value === "true");
                            }}
                          >
                            <option value="false">Regular Admin</option>
                            <option value="true">Super Admin</option>
                          </FormSelect>
                          {errors.isSuperAdmin && (
                            <div className="mt-2 text-danger text-sm">
                              {errors.isSuperAdmin.message}
                            </div>
                          )}
                        </div>
                      )}
                      {selectedRole === UserRole.Teacher && (
                        <>
                          <div>
                            <FormLabel htmlFor="department">Department</FormLabel>
                            <FormInput
                              {...register("department")}
                              id="department"
                              type="text"
                              placeholder="Computer Science"
                              className={clsx({
                                "border-danger": errors.department,
                              })}
                            />
                            {errors.department && (
                              <div className="mt-2 text-danger text-sm">
                                {errors.department.message}
                              </div>
                            )}
                          </div>
                          <div>
                            <FormLabel htmlFor="qualification">Qualification</FormLabel>
                            <FormInput
                              {...register("qualification")}
                              id="qualification"
                              type="text"
                              placeholder="PhD in Computer Science"
                              className={clsx({
                                "border-danger": errors.qualification,
                              })}
                            />
                            {errors.qualification && (
                              <div className="mt-2 text-danger text-sm">
                                {errors.qualification.message}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                      {selectedRole === UserRole.Student && (
                        <>
                          <div>
                            <FormLabel htmlFor="studentId">Student ID</FormLabel>
                            <FormInput
                              {...register("studentId")}
                              id="studentId"
                              type="text"
                              placeholder="S12345"
                              className={clsx({
                                "border-danger": errors.studentId,
                              })}
                            />
                            {errors.studentId && (
                              <div className="mt-2 text-danger text-sm">
                                {errors.studentId.message}
                              </div>
                            )}
                          </div>
                          <div>
                            <FormLabel htmlFor="year">Year</FormLabel>
                            <FormInput
                              {...register("year")}
                              id="year"
                              type="number"
                              placeholder="1"
                              className={clsx({
                                "border-danger": errors.year,
                              })}
                            />
                            {errors.year && (
                              <div className="mt-2 text-danger text-sm">
                                {errors.year.message}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-slate-200/60 text-right">
              <Button
                variant="outline-secondary"
                type="button"
                onClick={onClose}
                className="w-20 mr-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="w-20"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Lucide icon="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                    Saving
                  </div>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </Dialog>
      <Notification
        id="success-notification-content"
        className="flex hidden"
      >
        <Lucide icon="CheckCircle" className="text-success" />
        <div className="ml-4 mr-4">
          <div className="font-medium">User created successfully!</div>
          <div className="mt-1 text-slate-500">
            The new user has been added to the system.
          </div>
        </div>
      </Notification>
      <Notification
        id="failed-notification-content"
        className="flex hidden"
      >
        <Lucide icon="XCircle" className="text-danger" />
        <div className="ml-4 mr-4">
          <div className="font-medium">User creation failed!</div>
          <div className="mt-1 text-slate-500">
            Please check the form fields and try again.
          </div>
        </div>
      </Notification>
    </>
  );
};

export default UserFormModal;
