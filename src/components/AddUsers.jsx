import { Plus, Send } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendInvite } from "../hooks/invite";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";

const AddUsers = ({ onInviteSuccess }) => {
     const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: sendInvite,
        onSuccess: (data) => {
            toast.success("Invites sent successfully!");
            queryClient.invalidateQueries({ queryKey: ["users"] });

            if (onInviteSuccess) {
                onInviteSuccess();
            }
        },
        onError: (err) => {
            const errorMessage =
                err.response?.data?.message ||
                "Something went wrong while sending invites.";
            toast.error(errorMessage);
        },
    });

    const validationSchema = Yup.object({
        emails: Yup.array()
            .of(Yup.string().email("Invalid email").required("Email is required"))
            .min(1, "At least one email is required"),
    });

    const initialValues = {
        emails: [""],
    };

    return (
        <div className="flex justify-center items-center pt-6">
            <div className="bg-[#F6F9FC] shadow-sm rounded-2xl px-3 py-6 sm:p-8 w-full max-w-xl h-[80vh] sm:h-fit overflow-y-auto">
                <h2 className="text-xl sm:text-2xl p-semibold text-[#6667DD] text-center pb-2">
                    Invite Friends to Your Finance
                </h2>
                <p className="text-gray-600 text-sm mb-6 text-center border-b border-blue-200 pb-6">Send email invitations to connect and collaborate on financial transactions seamlessly.</p>


                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => {
                        mutate({ emails: values.emails }, { onSuccess: () => resetForm() });
                    }}
                >
                    {({ values, errors, touched }) => (
                        <Form className="space-y-4">
                            <FieldArray name="emails">
                                {({ push }) => (
                                    <>
                                        {values.emails.map((email, index) => (
                                            <div key={index} className="flex flex-col">
                                                <Field
                                                    type="email"
                                                    name={`emails.${index}`}
                                                    placeholder={`Friend's Email ${index + 1}`}
                                                    disabled={isPending}
                                                    className={`p-regular w-full px-4 py-2 rounded-lg outline-none text-gray-700 text-sm sm:text-base disabled:bg-gray-100 disabled:text-gray-500 border-2 ${errors.emails?.[index] && touched.emails?.[index]
                                                            ? "border-red-500"
                                                            : "border-[#6667DD]"
                                                        }`}
                                                />
                                                <ErrorMessage
                                                    name={`emails.${index}`}
                                                    component="div"
                                                    className="text-red-500 text-sm mt-1 p-regular"
                                                />
                                            </div>
                                        ))}

                                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                                            <button
                                                type="button"
                                                onClick={() => push("")}
                                                disabled={isPending}
                                                className="flex items-center justify-center gap-2 flex-1 py-2 rounded-lg bg-gradient-to-r from-[#6667DD] to-[#7C81F8] text-white p-medium hover:scale-97 transition-all duration-300 cursor-pointer w-full text-sm sm:text-base disabled:opacity-70"
                                            >
                                                <Plus size={18} /> Add Another
                                            </button>

                                            <button
                                                type="submit"
                                                disabled={isPending}
                                                className={`flex items-center justify-center gap-2 flex-1 py-2 rounded-lg text-white p-medium transition-all duration-300 cursor-pointer hover:scale-97 w-full text-sm sm:text-base ${isPending
                                                        ? "bg-green-300 hover:cursor-not-allowed"
                                                        : "bg-green-500 hover:bg-green-600"
                                                    }`}
                                            >
                                                <Send size={18} /> {isPending ? "Sending..." : "Send Invites"}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </FieldArray>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default AddUsers;
