import React, { useState } from "react";
import { Dialog } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import { FormInput, FormLabel, FormTextarea } from "@/components/Base/Form";
import { TeacherCourseController } from "@/controllers";
import { LectureRequest } from "@/services/TeacherService";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ConfirmationModal from "./ConfirmationModal";

interface LectureFormModalProps {
  open: boolean;
  onClose: () => void;
  courseId: string;
  lecture?: {
    id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    location: string;
  } | null;
  onSuccess: () => void;
}

// Form schema
const schema = yup.object().shape({
  title: yup.string().required("Title is required").min(3, "Title must be at least 3 characters"),
  description: yup.string().required("Description is required"),
  startTime: yup.string().required("Start time is required"),
  endTime: yup.string().required("End time is required"),
  location: yup.string().required("Location is required")
});

type LectureFormValues = {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
};

const LectureFormModal: React.FC<LectureFormModalProps> = ({
  open,
  onClose,
  courseId,
  lecture = null,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!lecture;
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState({
    title: "",
    message: ""
  });

  // Initialize form with react-hook-form
  const { register, handleSubmit, reset, formState: { errors } } = useForm<LectureFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: lecture?.title || "",
      description: lecture?.description || "",
      startTime: lecture?.startTime ? new Date(lecture.startTime).toISOString().slice(0, 16) : "",
      endTime: lecture?.endTime ? new Date(lecture.endTime).toISOString().slice(0, 16) : "",
      location: lecture?.location || ""
    }
  });

  // Reset form when modal opens or lecture changes
  React.useEffect(() => {
    if (open) {
      reset({
        title: lecture?.title || "",
        description: lecture?.description || "",
        startTime: lecture?.startTime ? new Date(lecture.startTime).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        endTime: lecture?.endTime ? new Date(lecture.endTime).toISOString().slice(0, 16) : new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16),
        location: lecture?.location || ""
      });
    }
  }, [open, lecture, reset]);

  const onSubmit: SubmitHandler<LectureFormValues> = async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      const lectureData: LectureRequest = {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location
      };
      
      let result;
      if (isEdit && lecture) {
        // Update existing lecture
        result = await TeacherCourseController.updateLecture(courseId, lecture.id, lectureData);
      } else {
        // Create new lecture
        result = await TeacherCourseController.addLecture(courseId, lectureData);
      }
      
      if (result.success) {
        setConfirmationMessage({
          title: isEdit ? "Lecture Updated" : "Lecture Added",
          message: isEdit 
            ? `The lecture "${data.title}" has been successfully updated.`
            : `A new lecture "${data.title}" has been successfully added to your course.`
        });
        setShowConfirmation(true);
      } else {
        setError(result.error || "Failed to save lecture");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    onSuccess();
  };

  return (
    <>
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
                {isEdit ? "Edit Lecture" : "Add Lecture"}
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
                  <FormLabel htmlFor="title">Lecture Title</FormLabel>
                  <FormInput
                    id="title"
                    type="text"
                    placeholder="Enter lecture title"
                    className={errors.title ? "border-danger" : ""}
                    {...register("title")}
                  />
                  {errors.title && (
                    <div className="mt-1 text-danger text-sm">{errors.title.message}</div>
                  )}
                </div>

                <div className="col-span-12">
                  <FormLabel htmlFor="description">Lecture Description</FormLabel>
                  <FormTextarea
                    id="description"
                    placeholder="Enter lecture description"
                    className={`min-h-[80px] ${errors.description ? "border-danger" : ""}`}
                    {...register("description")}
                  />
                  {errors.description && (
                    <div className="mt-1 text-danger text-sm">{errors.description.message}</div>
                  )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="startTime">Start Time</FormLabel>
                  <FormInput
                    id="startTime"
                    type="datetime-local"
                    className={errors.startTime ? "border-danger" : ""}
                    {...register("startTime")}
                  />
                  {errors.startTime && (
                    <div className="mt-1 text-danger text-sm">{errors.startTime.message}</div>
                  )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="endTime">End Time</FormLabel>
                  <FormInput
                    id="endTime"
                    type="datetime-local"
                    className={errors.endTime ? "border-danger" : ""}
                    {...register("endTime")}
                  />
                  {errors.endTime && (
                    <div className="mt-1 text-danger text-sm">{errors.endTime.message}</div>
                  )}
                </div>

                <div className="col-span-12">
                  <FormLabel htmlFor="location">Location</FormLabel>
                  <FormInput
                    id="location"
                    type="text"
                    placeholder="Enter lecture location"
                    className={errors.location ? "border-danger" : ""}
                    {...register("location")}
                  />
                  {errors.location && (
                    <div className="mt-1 text-danger text-sm">{errors.location.message}</div>
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
                    {isEdit ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>
                    <Lucide icon={isEdit ? "Save" : "Plus"} className="w-4 h-4 mr-2" />
                    {isEdit ? "Save Changes" : "Add Lecture"}
                  </>
                )}
              </Button>
            </Dialog.Footer>
          </form>
        </Dialog.Panel>
      </Dialog>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showConfirmation}
        onClose={handleConfirmationClose}
        title={confirmationMessage.title}
        message={confirmationMessage.message}
        icon="CheckCircle"
        iconColor="text-success"
      />
    </>
  );
};

export default LectureFormModal;
