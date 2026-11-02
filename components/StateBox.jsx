export default function StateBox({ icon: Icon, title, text, action }) {
  return (
    <div className="grid place-items-center rounded-3xl border border-dashed border-input bg-base-100 px-6 py-14 text-center">
      <div className="max-w-md space-y-4">
        {Icon && (
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="size-7" />
          </div>
        )}
        <h3 className="text-xl font-semibold">{title}</h3>
        {text && <p className="text-muted-foreground">{text}</p>}
        {action}
      </div>
    </div>
  );
}
