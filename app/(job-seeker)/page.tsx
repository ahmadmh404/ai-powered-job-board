import JobListingItems from "@/app/(job-seeker)/_shared/job-listing-items";

type Props = {
  searchParams: Promise<Record<string, string[]>>;
};

export default function HomePage(props: Props) {
  return (
    <div className="m-4">
      <JobListingItems {...props} />
    </div>
  );
}
