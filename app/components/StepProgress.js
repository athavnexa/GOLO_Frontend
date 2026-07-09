import { Check } from "lucide-react";

export default function StepProgress({ 
  isBasicInfoComplete = false,
  isCategoryDetailsComplete = false,
  isSchedulingComplete = false,
  isReviewComplete = false,
  currentStep = 1
}) {
  const steps = [
    { label: "Basic Info", isComplete: isBasicInfoComplete },
    { label: "Category Details", isComplete: isCategoryDetailsComplete },
    { label: "Scheduling & Targeting", isComplete: isSchedulingComplete },
    { label: "Review & Pay", isComplete: isReviewComplete },
  ];

  return (
    <div className="w-full max-w-full overflow-x-auto rounded-2xl pb-1 sm:overflow-visible sm:pb-0">
      <div className="flex w-max min-w-full items-center gap-2 rounded-2xl border border-gray-100 bg-white p-2.5 shadow-md sm:w-auto sm:min-w-0 sm:justify-between sm:gap-0 sm:p-6">
      {steps.map((step, i) => (
        <div key={i} className="flex min-w-[136px] items-center gap-2 sm:min-w-0 sm:flex-1 sm:gap-3">
          {/* Step Number or Checkmark */}
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all sm:h-10 sm:w-10 sm:text-sm ${
              step.isComplete
                ? "bg-green-500 text-white shadow-lg"
                : i + 1 === currentStep
                ? "bg-[#157A4F] text-white shadow-lg scale-110"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {step.isComplete ? (
              <Check size={16} strokeWidth={3} className="sm:h-5 sm:w-5" />
            ) : (
              i + 1
            )}
          </div>

          {/* Step Label */}
          <div className="flex min-w-[74px] flex-col sm:min-w-0">
            <p
              className={`text-xs font-semibold leading-tight transition sm:text-sm ${
                step.isComplete
                  ? "text-green-600"
                  : i + 1 === currentStep
                  ? "text-[#157A4F]"
                  : "text-gray-500"
              }`}
            >
              {step.label}
            </p>
            {step.isComplete && (
              <p className="text-[10px] font-medium text-green-500 sm:text-xs">Completed</p>
            )}
          </div>

          {/* Connector Line */}
          {i !== steps.length - 1 && (
            <div
              className={`h-1 w-5 shrink-0 rounded-full transition sm:mx-4 sm:flex-1 ${
                step.isComplete ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          )}
        </div>
      ))}
      </div>
    </div>
  );
}
