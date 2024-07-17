import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function SweetAlert({ props }) {
  return withReactContent(Swal)
    .fire({
      title: props.title,
      icon: props.icon,
      showCancelButton: props.showCancelButton,
      confirmButtonText: props.confirmButtonText,
      confirmButtonColor: "#00427f",
      cancelButtonColor: "#ef4444",
      showCloseButton: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        props.onConfirm();
      }
    });
}
