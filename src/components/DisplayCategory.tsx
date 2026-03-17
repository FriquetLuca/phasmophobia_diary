interface DisplayCategoryProps {
  isDisplayed: boolean;
  label: string;
  children: React.ReactNode;
}

export default function DisplayCategory({
  isDisplayed,
  label,
  children,
}: DisplayCategoryProps) {
  const displayClass = `flex flex-col ${isDisplayed ? '' : 'hidden'}`;
  return (
    <div className={displayClass}>
      <h3>{label}</h3>
      {children}
    </div>
  );
}
