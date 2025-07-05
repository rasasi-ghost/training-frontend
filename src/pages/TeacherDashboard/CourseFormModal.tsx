import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import { FormInput, FormLabel, FormTextarea, FormSwitch } from "@/components/Base/Form";
import { TeacherCourseController } from "@/controllers";
import { Course as BaseCourse, CreateCourseRequest, UpdateCourseRequest } from "@/services/TeacherService";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Extend the Course type to include enrollmentCount
interface Course extends BaseCourse {
  enrollmentCount?: number;
}

interface CourseFormModalProps {
  open: boolean;
  onClose: () => void;
  course: Course | null;
  isEdit: boolean;
  onSuccess: (course: Course) => void;
}

// Form schema - ensure it exactly matches CourseFormValues type
const schema = yup.object().shape({
  title: yup.string().required("Title is required").min(3, "Title must be at least 3 characters"),
  description: yup.string().required("Description is required").min(10, "Description must be at least 10 characters"),
  maxEnrollment: yup.number().required("Maximum enrollment is required").min(1, "Maximum enrollment must be at least 1"),
  startDate: yup.string().required("Start date is required"),
  endDate: yup.string().required("End date is required")
    .test('is-after-start-date', 'End date must be after start date', function(endDate) {
      const { startDate } = this.parent;
      if (!startDate || !endDate) return true;
      return new Date(endDate) > new Date(startDate);
    }),
  isActive: yup.boolean().required() // Make sure isActive is required to match the type
});

type CourseFormValues = {
  title: string;
  description: string;
  maxEnrollment: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

const CourseFormModal: React.FC<CourseFormModalProps> = ({
  open,
  onClose,
  course,
  isEdit,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form with react-hook-form
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CourseFormValues>({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      maxEnrollment: 30,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 4)).toISOString().split('T')[0],
      isActive: true
    }
  });

  // Set form values when course changes
  useEffect(() => {
    if (course && isEdit) {
      reset({
        title: course.title,
        description: course.description,
        maxEnrollment: course.maxEnrollment,
        startDate: course.startDate.split('T')[0],
        endDate: course.endDate.split('T')[0],
        isActive: course.isActive
      });
    } else {
      reset({
        title: "",
        description: "",
        maxEnrollment: 30,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 4)).toISOString().split('T')[0],
        isActive: true
      });
    }
  }, [course, isEdit, reset, open]);

  const onSubmit: SubmitHandler<CourseFormValues> = async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      if (isEdit && course) {
        // Update existing course
        const updateData: UpdateCourseRequest = {
          title: data.title,
          description: data.description,
          maxEnrollment: data.maxEnrollment,
          startDate: data.startDate,
          endDate: data.endDate,
          isActive: data.isActive
        };
        
        const result = await TeacherCourseController.updateCourse(course.id, updateData);
        if (result.success) {
          // Get updated course data
          const courseResult = await TeacherCourseController.getCourseDetails(course.id);
          if (courseResult.success && courseResult.course) {
            onSuccess(courseResult.course);
          }
        } else {
          setError(result.error || "Failed to update course");
        }
      } else {
        // Create new course
        const createData: CreateCourseRequest = {
          title: data.title,
          description: data.description,
          maxEnrollment: data.maxEnrollment,
          startDate: data.startDate,
          endDate: data.endDate,
        };
        
        const result = await TeacherCourseController.createCourse(createData);
        if (result.success && result.courseId) {
          // Get new course data
          const courseResult = await TeacherCourseController.getCourseDetails(result.courseId);
          if (courseResult.success && courseResult.course) {
            onSuccess(courseResult.course);
          }
        } else {
          setError(result.error || "Failed to create course");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      size="lg"
      open={open}
      onClose={() => {
        if (!loading) onClose();
      }}
    >
      <Dialog.Panel>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">
              {isEdit ? "Edit Course" : "Create New Course"}
            </h2>
          </Dialog.Title>
          <Dialog.Description>
            <div className="grid grid-cols-12 gap-4 gap-y-3">
              {error && (
                <div className="col-span-12">
                  <div className="px-4 py-3 text-sm text-white rounded-md bg-danger">
                    {error}
                  </div>
                </div>
              )}
              
              <div className="col-span-12">
                <FormLabel htmlFor="title">Course Title</FormLabel>
                <FormInput
                  id="title"
                  type="text"
                  placeholder="Enter course title"
                  className={errors.title ? "border-danger" : ""}
                  {...register("title")}
                />
                {errors.title && (
                  <div className="mt-1 text-danger text-sm">{errors.title.message}</div>
                )}
              </div>

              <div className="col-span-12">
                <FormLabel htmlFor="description">Course Description</FormLabel>
                <FormTextarea
                  id="description"
                  placeholder="Enter course description"
                  className={`min-h-[100px] ${errors.description ? "border-danger" : ""}`}
                  {...register("description")}
                />
                {errors.description && (
                  <div className="mt-1 text-danger text-sm">{errors.description.message}</div>
                )}
              </div>

              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="maxEnrollment">Maximum Enrollment</FormLabel>
                <FormInput
                  id="maxEnrollment"
                  type="number"
                  min="1"
                  className={errors.maxEnrollment ? "border-danger" : ""}
                  {...register("maxEnrollment", { valueAsNumber: true })}
                />
                {errors.maxEnrollment && (
                  <div className="mt-1 text-danger text-sm">{errors.maxEnrollment.message}</div>
                )}
              </div>
              
              <div className="col-span-12 sm:col-span-6">
                {isEdit && (
                  <div className="mt-6">
                    <FormSwitch>
                      <FormSwitch.Label htmlFor="isActive" className="mr-2">Active Status</FormSwitch.Label>
                      <FormSwitch.Input
                        id="isActive"
                        type="checkbox"
                        {...register("isActive")}
                      />
                    </FormSwitch>
                  </div>
                )}
              </div>

              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="startDate">Start Date</FormLabel>
                <FormInput
                  id="startDate"
                  type="date"
                  className={errors.startDate ? "border-danger" : ""}
                  {...register("startDate")}
                />
                {errors.startDate && (
                  <div className="mt-1 text-danger text-sm">{errors.startDate.message}</div>
                )}
              </div>

              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="endDate">End Date</FormLabel>
                <FormInput
                  id="endDate"
                  type="date"
                  className={errors.endDate ? "border-danger" : ""}
                  {...register("endDate")}
                />
                {errors.endDate && (
                  <div className="mt-1 text-danger text-sm">{errors.endDate.message}</div>
                )}
              </div>
            </div>
          </Dialog.Description>
          <Dialog.Footer>
            <Button
              type="button"
              variant="outline-secondary"
              onClick={onClose}
              className="w-20 mr-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="w-auto"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  {isEdit ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Lucide icon={isEdit ? "Save" : "Plus"} className="w-4 h-4 mr-2" />
                  {isEdit ? "Save Changes" : "Create Course"}
                </>
              )}
            </Button>
          </Dialog.Footer>
        </form>
      </Dialog.Panel>
    </Dialog>
  );
};

export default CourseFormModal;
