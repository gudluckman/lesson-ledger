import { ButtonProps } from "@mui/material";
import { Button } from '@pankod/refine-mui'

interface CancelButtonProps extends ButtonProps {
  title: string;
}

const CancelButton = ({ title, ...props }: CancelButtonProps) => {
  return (
    <Button {...props}>
      {title}
    </Button>
  );
};

export default CancelButton;
