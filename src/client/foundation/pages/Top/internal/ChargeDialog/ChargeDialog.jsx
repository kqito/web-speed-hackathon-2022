import React, { forwardRef, Suspense, useCallback, useState } from "react";

import { Dialog } from "../../../../components/layouts/Dialog";
import { useMutation } from "../../../../hooks/useMutation";

const CANCEL = "cancel";

const ChargeDialogInner = React.lazy(() => import("./ChargeDialogInner.jsx"));

/**
 * @typedef Props
 * @type {object}
 */

/** @type {React.ForwardRefExoticComponent<{Props>} */
export const ChargeDialog = forwardRef(({ onComplete }, ref) => {
  const [bankCode, setBankCode] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [amount, setAmount] = useState(0);

  const clearForm = useCallback(() => {
    setBankCode("");
    setBranchCode("");
    setAccountNo("");
    setAmount(0);
  }, []);

  const [charge] = useMutation("/api/users/me/charge", {
    auth: true,
    method: "POST",
  });

  const handleCloseDialog = useCallback(
    async (e) => {
      if (e.currentTarget.returnValue === CANCEL) {
        clearForm();
        return;
      }

      await charge({ accountNo, amount, bankCode, branchCode });
      clearForm();
      onComplete();
    },
    [charge, bankCode, branchCode, accountNo, amount, onComplete, clearForm],
  );

  return (
    <Dialog ref={ref} onClose={handleCloseDialog}>
      <Suspense fallback={<></>}>
        <ChargeDialogInner />
      </Suspense>
    </Dialog>
  );
});

ChargeDialog.displayName = "ChargeDialog";
