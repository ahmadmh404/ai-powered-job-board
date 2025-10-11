import { JobListingAISearchForm } from "@/features/job-listings/components/job-listing-ai-search-form";
import { SignUpButton } from "@/services/clerk/components/auth-buttons";
import { getCurrentUser } from "@/services/clerk/lib/get-current-auth";
import AsyncIf from "@/components/async-if";
import { LoadingSwap } from "@/components/loading-swap";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AISearchPage() {
  return (
    <div className="p-4 min-h-full flex items-center justify-center">
      <Card className="max-w-4xl">
        <AsyncIf
          condition={async () => {
            const { userId } = await getCurrentUser();
            return userId != null;
          }}
          fallback={
            <LoadingSwap isLoading>
              <AICard />
            </LoadingSwap>
          }
          otherwise={<NoPermission />}
        >
          <AICard />
        </AsyncIf>
      </Card>
    </div>
  );
}

function AICard() {
  return (
    <>
      <CardHeader>
        <CardTitle>AI Search</CardTitle>
        <CardDescription>
          This can take a few minutes to process, so please be patient.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <JobListingAISearchForm />
      </CardContent>
    </>
  );
}

function NoPermission() {
  return (
    <CardContent className="text-center">
      <h2 className="text-xl font-bold mb-2">Permission Denied.</h2>
      <p className="mb-4 text-muted-foreground">
        You need to create an account before using AI Search.
      </p>

      <SignUpButton />
    </CardContent>
  );
}
