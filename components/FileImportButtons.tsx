import { getFile } from "@/actions/getFIle";
import { Button } from "@/components/ui/button";

export function FileImportButtons() {
  return (
    <form action={getFile} className="flex gap-4 items-center">
      {/* Import Text */}
      <input
        type="file"
        id="text"
        accept=".txt"
        className="hidden"
        name="text"
      />
      <label htmlFor="text">
        <Button type="button" asChild>
          <span>+ Import Text</span>
        </Button>
      </label>
      <Button variant={'secondary'} type="submit">Submit</Button>
    </form>
  );
}
