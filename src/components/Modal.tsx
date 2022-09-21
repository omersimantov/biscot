import * as Dialog from "@radix-ui/react-dialog";
import React from "react";

const mockPromise = async (): Promise<void> => await new Promise((resolve) => setTimeout(resolve, 1000));

export const Modal = (): JSX.Element => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger />
      <Dialog.Portal>
        <Dialog.Overlay>
          <Dialog.Content>
            <form
              onSubmit={async (): Promise<void> => {
                mockPromise().then(() => setOpen(false));
              }}>
              <button type="submit">Submit</button>
            </form>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
