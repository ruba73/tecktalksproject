import { PlanGeneratorHeader } from "@/components/ai-setup/PlanGeneratorHeader";
import { SubjectsList } from "@/components/ai-setup/SubjectsList";
import { AddSubjectForm } from "@/components/ai-setup/AddSubjectForm";
import { AvailabilityForm } from "@/components/ai-setup/AvailabilityForm";
import { GenerateButton } from "@/components/ai-setup/GenerateButton";
export default function AISetupPage() {
  return (
    <div className="min-h-full bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        <PlanGeneratorHeader/>
<SubjectsList/>
<AddSubjectForm />
<AvailabilityForm/>
          <GenerateButton />

        {/* Page Header */}
        {/* <div className="space-y-6 sm:space-y-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            AI Study Plan Setup
          </h1>
        </div> */}
        
        {/* Content will go here */}
         <div className="space-y-6 sm:space-y-8">
          {/* <PlanGeneratorHeader/> */}
          {/* <SubjectsList/> */}
        </div>
      </div>
    </div>
  );
}