import { Spinner } from "../luxe/spinner";

function SpinnerComponent() {
  return (
    // overlay fijo que cubre toda la pantalla y centra el spinner
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" />
      <div className="relative">
        <Spinner size="size-20" className="m-auto" />
      </div>
    </div>
  );
}

export default SpinnerComponent;
