import { useState } from "react";
import { FormCheck, FormInput, FormLabel, FormSelect } from "@/components/Base/Form";
import Tippy from "@/components/Base/Tippy";
import users from "@/fakers/users";
import Button from "@/components/Base/Button";
import { Dialog } from "@/components/Base/Headless";
import Lucide from "@/components/Base/Lucide";
import clsx from "clsx";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import UserController from "@/controllers/UserController";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import UserStore from "@/state/UserStore";

// Schema for student registration
const studentSchema = yup.object({
  displayName: yup.string().required("Full name is required").min(2, "Name must be at least 2 characters"),
  email: yup.string().required("Email is required").email("Please enter a valid email address"),
  year: yup.string()
    .required("Study year is required")
    .test('is-number', 'Year must be between 1 and 6', value => {
      if (!value) return false;
      const numValue = parseInt(value);
      return !isNaN(numValue) && numValue >= 1 && numValue <= 6;
    }),
  password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
  confirmPassword: yup.string()
    .required("Please confirm your password")
    .oneOf([yup.ref('password')], "Passwords must match"),
  agreeTerms: yup.boolean().oneOf([true], "You must agree to the terms and conditions")
});

// Schema for teacher registration
const teacherSchema = yup.object({
  displayName: yup.string().required("Full name is required").min(2, "Name must be at least 2 characters"),
  email: yup.string().required("Email is required").email("Please enter a valid email address"),
  department: yup.string().required("Department is required"),
  qualification: yup.string().required("Qualification is required"),
  password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
  confirmPassword: yup.string()
    .required("Please confirm your password")
    .oneOf([yup.ref('password')], "Passwords must match"),
  agreeTerms: yup.boolean().oneOf([true], "You must agree to the terms and conditions")
});

function Main() {
  const [registrationType, setRegistrationType] = useState("student");
  const [successModal, setSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({
    title: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Student form setup
  const {
    register: registerStudent,
    handleSubmit: handleStudentSubmit,
    formState: { errors: studentErrors },
    setValue: setStudentValue,
    watch: watchStudent
  } = useForm({
    resolver: yupResolver(studentSchema),
    mode: "onChange",
    defaultValues: {
      displayName: "",
      email: "",
      year: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false
    }
  });

  // Watch the year field for debugging
  const yearValue = watchStudent("year");
  
  // Handle year change explicitly
  const handleYearChange = (e:any) => {
    const value = e.target.value;
    setStudentValue("year", value, { shouldValidate: true });
  };

  // Teacher form setup
  const {
    register: registerTeacher,
    handleSubmit: handleTeacherSubmit,
    formState: { errors: teacherErrors }
  } = useForm({
    resolver: yupResolver(teacherSchema),
    mode: "onChange"
  });

  // Handle student registration submission
  const onStudentSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await UserController.registerStudent(
        data.email,
        data.password,
        data.displayName,
        parseInt(data.year)
      );
      
      setModalMessage({
        title: "Registration Successful!",
        message: "Your student account has been created. You will be redirected to your dashboard."
      });
      setSuccessModal(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate(UserStore.dashboardRoute);
      }, 2000);
    } catch (error) {
      console.error("Student registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle teacher registration submission
  const onTeacherSubmit = async (data:any) => {
    setIsSubmitting(true);
    try {
      await UserController.registerTeacher(
        data.email,
        data.password,
        data.displayName,
        data.department,
        data.qualification
      );
      
      setModalMessage({
        title: "Registration Submitted",
        message: "Your teacher account has been registered and is pending approval. You will be redirected to the login page."
      });
      setSuccessModal(true);
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Teacher registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="container grid lg:h-screen grid-cols-12 lg:max-w-[1550px] 2xl:max-w-[1750px] py-10 px-5 sm:py-14 sm:px-10 md:px-36 lg:py-0 lg:pl-14 lg:pr-12 xl:px-24">
        <div
          className={clsx([
            "relative z-50 h-full col-span-12 p-7 sm:p-14 bg-white rounded-2xl lg:bg-transparent lg:pr-10 lg:col-span-5 xl:pr-24 2xl:col-span-4 lg:p-0 dark:bg-darkmode-600",
            "before:content-[''] before:absolute before:inset-0 before:-mb-3.5 before:bg-white/40 before:rounded-2xl before:mx-5 dark:before:hidden",
          ])}
        >
          <div className="relative z-10 flex flex-col justify-center w-full h-full py-2 lg:py-32">
            {/* <div className="rounded-[0.8rem] w-[55px] h-[55px] border border-primary/30 flex items-center justify-center">
              <div className="relative flex items-center justify-center w-[50px] rounded-[0.6rem] h-[50px] bg-gradient-to-b from-theme-1/90 to-theme-2/90 bg-white">
                <div className="w-[26px] h-[26px] relative -rotate-45 [&_div]:bg-white">
                  <div className="absolute w-[20%] left-0 inset-y-0 my-auto rounded-full opacity-50 h-[75%]"></div>
                  <div className="absolute w-[20%] inset-0 m-auto h-[120%] rounded-full"></div>
                  <div className="absolute w-[20%] right-0 inset-y-0 my-auto rounded-full opacity-50 h-[75%]"></div>
                </div>
              </div>
            </div> */}
            <div className="mt-10">
              <div className="text-2xl font-medium">Join Alarkkan Training Center</div>
              <div className="mt-2.5 text-slate-600 dark:text-slate-400">
                Already have an account?{" "}
                <a className="font-medium text-primary" href="/login">
                  Sign In
                </a>
              </div>
              
              {/* Registration Type Selector */}
              <div className="flex mt-6 border-b border-slate-200">
                <button 
                  className={`px-4 py-2 font-medium ${registrationType === "student" ? 'text-primary border-b-2 border-primary' : 'text-slate-500'}`}
                  onClick={() => setRegistrationType("student")}
                >
                  Student
                </button>
                <button 
                  className={`px-4 py-2 font-medium ${registrationType === "teacher" ? 'text-primary border-b-2 border-primary' : 'text-slate-500'}`}
                  onClick={() => setRegistrationType("teacher")}
                >
                  Instructor
                </button>
              </div>
              
              {/* Student Registration Form */}
              {registrationType === "student" && (
                <form onSubmit={handleStudentSubmit(onStudentSubmit)} className="mt-6">
                  <FormLabel>Full Name*</FormLabel>
                  <FormInput
                    {...registerStudent("displayName")}
                    type="text"
                    className={clsx("block px-4 py-3.5 rounded-[0.6rem] border-slate-300/80", {
                      "border-danger": studentErrors.displayName
                    })}
                    placeholder="John Doe"
                  />
                  {studentErrors.displayName && (
                    <div className="mt-2 text-danger text-sm">{studentErrors.displayName.message}</div>
                  )}
                  
                  <FormLabel className="mt-5">Email*</FormLabel>
                  <FormInput
                    {...registerStudent("email")}
                    type="email"
                    className={clsx("block px-4 py-3.5 rounded-[0.6rem] border-slate-300/80", {
                      "border-danger": studentErrors.email
                    })}
                    placeholder="example@gmail.com"
                  />
                  {studentErrors.email && (
                    <div className="mt-2 text-danger text-sm">{studentErrors.email.message}</div>
                  )}
                  
                  <FormLabel className="mt-5">Study Year*</FormLabel>
                  <select
                    {...registerStudent("year")}
                    onChange={handleYearChange}
                    className={clsx("form-select block px-4 py-3.5 rounded-[0.6rem] border-slate-300/80 w-full", {
                      "border-danger": studentErrors.year
                    })}
                  >
                    <option value="">Select Year</option>
                    <option value="1">Year 1</option>
                    <option value="2">Year 2</option>
                    <option value="3">Year 3</option>
                    <option value="4">Year 4</option>
                    <option value="5">Year 5</option>
                    <option value="6">Year 6</option>
                  </select>
                  {studentErrors.year && (
                    <div className="mt-2 text-danger text-sm">{studentErrors.year.message}</div>
                  )}
                  
                  <FormLabel className="mt-5">Password*</FormLabel>
                  <FormInput
                    {...registerStudent("password")}
                    type="password"
                    className={clsx("block px-4 py-3.5 rounded-[0.6rem] border-slate-300/80", {
                      "border-danger": studentErrors.password
                    })}
                    placeholder="************"
                  />
                  {studentErrors.password && (
                    <div className="mt-2 text-danger text-sm">{studentErrors.password.message}</div>
                  )}
                  
                  <div className="grid w-full h-1.5 grid-cols-12 gap-4 mt-3.5">
                    <div className="h-full col-span-3 border rounded active bg-slate-400/30 border-slate-400/20 [&.active]:bg-theme-1/30 [&.active]:border-theme-1/20"></div>
                    <div className="h-full col-span-3 border rounded active bg-slate-400/30 border-slate-400/20 [&.active]:bg-theme-1/30 [&.active]:border-theme-1/20"></div>
                    <div className="h-full col-span-3 border rounded active bg-slate-400/30 border-slate-400/20 [&.active]:bg-theme-1/30 [&.active]:border-theme-1/20"></div>
                    <div className="h-full col-span-3 border rounded bg-slate-400/30 border-slate-400/20 [&.active]:bg-theme-1/30 [&.active]:border-theme-1/20"></div>
                  </div>
                  
                  <a
                    href=""
                    className="block mt-3 text-xs text-slate-500/80 sm:text-sm dark:text-slate-400"
                  >
                    What is a secure password?
                  </a>
                  
                  <FormLabel className="mt-5">Confirm Password*</FormLabel>
                  <FormInput
                    {...registerStudent("confirmPassword")}
                    type="password"
                    className={clsx("block px-4 py-3.5 rounded-[0.6rem] border-slate-300/80", {
                      "border-danger": studentErrors.confirmPassword
                    })}
                    placeholder="************"
                  />
                  {studentErrors.confirmPassword && (
                    <div className="mt-2 text-danger text-sm">{studentErrors.confirmPassword.message}</div>
                  )}
                  
                  <div className="flex items-center mt-5 text-xs text-slate-500 sm:text-sm">
                    <FormCheck.Input
                      id="student-agree-terms"
                      {...registerStudent("agreeTerms")}
                      type="checkbox"
                      className="mr-2 border"
                    />
                    <label
                      className="cursor-pointer select-none"
                      htmlFor="student-agree-terms"
                    >
                      I agree to the Envato
                    </label>
                    <a className="ml-1 text-primary dark:text-slate-200" href="">
                      Privacy Policy
                    </a>
                    .
                  </div>
                  {studentErrors.agreeTerms && (
                    <div className="mt-2 text-danger text-sm">{studentErrors.agreeTerms.message}</div>
                  )}
                  
                  <div className="mt-5 text-center xl:mt-8 xl:text-left">
                    <Button
                      variant="primary"
                      type="submit"
                      rounded
                      className="bg-gradient-to-r from-theme-1/70 to-theme-2/70 w-full py-3.5 xl:mr-3 dark:border-darkmode-400"
                      disabled={UserStore.loading || isSubmitting}
                    >
                      {UserStore.loading || isSubmitting ? "Registering..." : "Register as Student"}
                    </Button>
                  </div>
                  
                  {UserStore.error && (
                    <div className="mt-3 text-danger text-center">{UserStore.error}</div>
                  )}
                </form>
              )}
              
              {/* Teacher Registration Form */}
              {registrationType === "teacher" && (
                <form onSubmit={handleTeacherSubmit(onTeacherSubmit)} className="mt-6">
                  <FormLabel>Full Name*</FormLabel>
                  <FormInput
                    {...registerTeacher("displayName")}
                    type="text"
                    className={clsx("block px-4 py-3.5 rounded-[0.6rem] border-slate-300/80", {
                      "border-danger": teacherErrors.displayName
                    })}
                    placeholder="Prof. John Doe"
                  />
                  {teacherErrors.displayName && (
                    <div className="mt-2 text-danger text-sm">{teacherErrors.displayName.message}</div>
                  )}
                  
                  <FormLabel className="mt-5">Email*</FormLabel>
                  <FormInput
                    {...registerTeacher("email")}
                    type="email"
                    className={clsx("block px-4 py-3.5 rounded-[0.6rem] border-slate-300/80", {
                      "border-danger": teacherErrors.email
                    })}
                    placeholder="professor@university.edu"
                  />
                  {teacherErrors.email && (
                    <div className="mt-2 text-danger text-sm">{teacherErrors.email.message}</div>
                  )}
                  
                  <FormLabel className="mt-5">Department*</FormLabel>
                  <FormInput
                    {...registerTeacher("department")}
                    type="text"
                    className={clsx("block px-4 py-3.5 rounded-[0.6rem] border-slate-300/80", {
                      "border-danger": teacherErrors.department
                    })}
                    placeholder="Computer Science"
                  />
                  {teacherErrors.department && (
                    <div className="mt-2 text-danger text-sm">{teacherErrors.department.message}</div>
                  )}
                  
                  <FormLabel className="mt-5">Qualification*</FormLabel>
                  <FormInput
                    {...registerTeacher("qualification")}
                    type="text"
                    className={clsx("block px-4 py-3.5 rounded-[0.6rem] border-slate-300/80", {
                      "border-danger": teacherErrors.qualification
                    })}
                    placeholder="PhD in Computer Science"
                  />
                  {teacherErrors.qualification && (
                    <div className="mt-2 text-danger text-sm">{teacherErrors.qualification.message}</div>
                  )}
                  
                  <FormLabel className="mt-5">Password*</FormLabel>
                  <FormInput
                    {...registerTeacher("password")}
                    type="password"
                    className={clsx("block px-4 py-3.5 rounded-[0.6rem] border-slate-300/80", {
                      "border-danger": teacherErrors.password
                    })}
                    placeholder="************"
                  />
                  {teacherErrors.password && (
                    <div className="mt-2 text-danger text-sm">{teacherErrors.password.message}</div>
                  )}
                  
                  <div className="grid w-full h-1.5 grid-cols-12 gap-4 mt-3.5">
                    <div className="h-full col-span-3 border rounded active bg-slate-400/30 border-slate-400/20 [&.active]:bg-theme-1/30 [&.active]:border-theme-1/20"></div>
                    <div className="h-full col-span-3 border rounded active bg-slate-400/30 border-slate-400/20 [&.active]:bg-theme-1/30 [&.active]:border-theme-1/20"></div>
                    <div className="h-full col-span-3 border rounded active bg-slate-400/30 border-slate-400/20 [&.active]:bg-theme-1/30 [&.active]:border-theme-1/20"></div>
                    <div className="h-full col-span-3 border rounded bg-slate-400/30 border-slate-400/20 [&.active]:bg-theme-1/30 [&.active]:border-theme-1/20"></div>
                  </div>
                  
                  <a
                    href=""
                    className="block mt-3 text-xs text-slate-500/80 sm:text-sm dark:text-slate-400"
                  >
                    What is a secure password?
                  </a>
                  
                  <FormLabel className="mt-5">Confirm Password*</FormLabel>
                  <FormInput
                    {...registerTeacher("confirmPassword")}
                    type="password"
                    className={clsx("block px-4 py-3.5 rounded-[0.6rem] border-slate-300/80", {
                      "border-danger": teacherErrors.confirmPassword
                    })}
                    placeholder="************"
                  />
                  {teacherErrors.confirmPassword && (
                    <div className="mt-2 text-danger text-sm">{teacherErrors.confirmPassword.message}</div>
                  )}
                  
                  <div className="flex items-center mt-5 text-xs text-slate-500 sm:text-sm">
                    <FormCheck.Input
                      id="teacher-agree-terms"
                      {...registerTeacher("agreeTerms")}
                      type="checkbox"
                      className="mr-2 border"
                    />
                    <label
                      className="cursor-pointer select-none"
                      htmlFor="teacher-agree-terms"
                    >
                      I agree to the Envato
                    </label>
                    <a className="ml-1 text-primary dark:text-slate-200" href="">
                      Privacy Policy
                    </a>
                    .
                  </div>
                  {teacherErrors.agreeTerms && (
                    <div className="mt-2 text-danger text-sm">{teacherErrors.agreeTerms.message}</div>
                  )}
                  
                  <div className="mt-5 text-center xl:mt-8 xl:text-left">
                    <Button
                      variant="primary"
                      type="submit"
                      rounded
                      className="bg-gradient-to-r from-theme-1/70 to-theme-2/70 w-full py-3.5 xl:mr-3 dark:border-darkmode-400"
                      disabled={UserStore.loading || isSubmitting}
                    >
                      {UserStore.loading || isSubmitting ? "Registering..." : "Register as Instructor"}
                    </Button>
                  </div>
                  
                  {UserStore.error && (
                    <div className="mt-3 text-danger text-center">{UserStore.error}</div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Success Modal */}
      <Dialog
        open={successModal}
        onClose={() => {
          setSuccessModal(false);
        }}
      >
        <Dialog.Panel>
          <div className="p-5 text-center">
            <Lucide
              icon="CheckCircle"
              className="w-16 h-16 mx-auto mt-3 text-success"
            />
            <div className="mt-5 text-3xl">{modalMessage.title}</div>
            <div className="mt-2 text-slate-500">
              {modalMessage.message}
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                setSuccessModal(false);
              }}
              className="w-24"
            >
              OK
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>

      <div className="fixed container grid w-screen inset-0 h-screen grid-cols-12 lg:max-w-[1550px] 2xl:max-w-[1750px] pl-14 pr-12 xl:px-24">
        <div
          className={clsx([
            "relative h-screen col-span-12 lg:col-span-5 2xl:col-span-4 z-20",
            "after:bg-white after:hidden after:lg:block after:content-[''] after:absolute after:right-0 after:inset-y-0 after:bg-gradient-to-b after:from-white after:to-slate-100/80 after:w-[800%] after:rounded-[0_1.2rem_1.2rem_0/0_1.7rem_1.7rem_0] dark:after:bg-darkmode-600 dark:after:from-darkmode-600 dark:after:to-darkmode-600",
            "before:content-[''] before:hidden before:lg:block before:absolute before:right-0 before:inset-y-0 before:my-6 before:bg-gradient-to-b before:from-white/10 before:to-slate-50/10 before:bg-white/50 before:w-[800%] before:-mr-4 before:rounded-[0_1.2rem_1.2rem_0/0_1.7rem_1.7rem_0] dark:before:from-darkmode-300 dark:before:to-darkmode-300",
          ])}
        ></div>
        <div
          className={clsx([
            "h-full col-span-7 2xl:col-span-8 lg:relative",
            "before:content-[''] before:absolute before:lg:-ml-10 before:left-0 before:inset-y-0 before:bg-gradient-to-b before:from-theme-1 before:to-theme-2 before:w-screen before:lg:w-[800%]",
            "after:content-[''] after:absolute after:inset-y-0 after:left-0 after:w-screen after:lg:w-[800%] after:bg-texture-white after:bg-fixed after:bg-center after:lg:bg-[25rem_-25rem] after:bg-no-repeat",
          ])}
        >
          <div className="sticky top-0 z-10 flex-col justify-center hidden h-screen ml-16 lg:flex xl:ml-28 2xl:ml-36">
            <div className="leading-[1.4] text-[2.6rem] xl:text-5xl font-medium xl:leading-[1.2] text-white">
              Alarkkan Training Center <br /> Empowering Skills for Success
            </div>
            <div className="mt-5 text-base leading-relaxed xl:text-lg text-white/70">
              Join Alarkkan Training Center to access quality professional courses and development opportunities. 
              Whether you're a student seeking to enhance your skills or an instructor sharing expertise, 
              our platform provides the tools and resources you need to succeed.
            </div>
            <div className="flex flex-col gap-3 mt-10 xl:items-center xl:flex-row">
              <div className="flex items-center">
                <div className="w-9 h-9 2xl:w-11 2xl:h-11 image-fit zoom-in">
                  <Tippy
                    as="img"
                    alt="Tailwise - Admin Dashboard Template"
                    className="rounded-full border-[3px] border-white/50"
                    src={users.fakeUsers()[0].photo}
                    content={users.fakeUsers()[0].name}
                  />
                </div>
                <div className="-ml-3 w-9 h-9 2xl:w-11 2xl:h-11 image-fit zoom-in">
                  <Tippy
                    as="img"
                    alt="Tailwise - Admin Dashboard Template"
                    className="rounded-full border-[3px] border-white/50"
                    src={users.fakeUsers()[1].photo}
                    content={users.fakeUsers()[1].name}
                  />
                </div>
                <div className="-ml-3 w-9 h-9 2xl:w-11 2xl:h-11 image-fit zoom-in">
                  <Tippy
                    as="img"
                    alt="Tailwise - Admin Dashboard Template"
                    className="rounded-full border-[3px] border-white/50"
                    src={users.fakeUsers()[2].photo}
                    content={users.fakeUsers()[2].name}
                  />
                </div>
                <div className="-ml-3 w-9 h-9 2xl:w-11 2xl:h-11 image-fit zoom-in">
                  <Tippy
                    as="img"
                    alt="Tailwise - Admin Dashboard Template"
                    className="rounded-full border-[3px] border-white/50"
                    src={users.fakeUsers()[3].photo}
                    content={users.fakeUsers()[3].name}
                  />
                </div>
              </div>
              <div className="text-base xl:ml-2 2xl:ml-3 text-white/70">
                Join thousands of professionals in our growing training community!
              </div>
            </div>
          </div>
        </div>
      </div>
      <ThemeSwitcher />
    </>
  );
}

export default observer(Main);
