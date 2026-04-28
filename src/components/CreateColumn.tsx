import { Dispatch, SetStateAction } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Field, FieldGroup } from './ui/field';
import { Button } from './ui/button';

type CreateColumnProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

function CreateColumn({ open, setOpen }: CreateColumnProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-foreground p-8" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-primary-text heading-lg">
            Add New Column
          </DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <label htmlFor="name" className="body-md text-secondary-text">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="e.g. Web Design"
              className="border border-[#828FA3] px-4 py-2 rounded-sm"
            />

            <Button className="heading-md text-button-primary bg-button-secondary hover:bg-button-secondary-hover cursor-pointer px-4.5  py-4.5 rounded-3xl disabled:pointer-events-none">
              + Add New Column
            </Button>
          </Field>
        </FieldGroup>
      </DialogContent>
    </Dialog>
  );
}

export default CreateColumn;
