import { User } from 'firebase/auth';
import { Report } from '../../../models/report';
import { validateReport } from '../../../utils/dataValidation/validateReport';
import { displayNotif } from '../../../utils/misc/toast';

type Violation = {
    name: string;
    selected: boolean;
};

export function handleOnSubmitReport(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    violations: Violation[],
    user: User | null | undefined,
    type: 'user' | 'post',
    contentId: string,
    showStateHandler: (s: boolean) => void,
    note: string,
    setIsSubmitting: (s: boolean) => void
) {
    e.preventDefault();

    const selectedViolations = violations
        .filter((v) => v.selected)
        .map((v) => v.name);
    const validation = validateReport(user, selectedViolations);

    if (!validation.success) {
        displayNotif(validation.message, 'error');
        return;
    }

    const newReport = new Report(
        type,
        user!.uid,
        contentId,
        selectedViolations,
        note
    );
    setIsSubmitting(true);

    newReport
        .submit()
        .then(() => {
            setIsSubmitting(false);
            showStateHandler(false);
            displayNotif('Thank you for submitting a report.', 'success');
        })
        .catch(() => {
            setIsSubmitting(false);
            displayNotif(
                'Failed to submit the report. Please sign in first.',
                'error'
            );
        });
}

export function handleOnClickViolation(
    violations: {
        name: string;
        selected: boolean;
    }[],
    setViolations: (v: Violation[]) => void,
    selectedViolation: Violation
) {
    setViolations(
        violations.map((v) => {
            if (v.name === selectedViolation.name)
                return {
                    name: selectedViolation.name,
                    selected: !selectedViolation.selected,
                };

            return v;
        })
    );
}
