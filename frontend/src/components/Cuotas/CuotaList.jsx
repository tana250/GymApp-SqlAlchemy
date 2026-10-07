import CuotaCard from "./CuotaCard";

export default function CuotaList({
  cuotas,
  onSelect,
}) {
  if (!cuotas.length) {
    return <p>No hay cuotas.</p>;
  }

  return (
    <div>
      {cuotas.map((cuota) => (
        <CuotaCard
          key={cuota.id}
          cuota={cuota}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}