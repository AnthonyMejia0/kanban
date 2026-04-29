type ColumnProps = {
  title: string;
};

function Column({ title }: ColumnProps) {
  return (
    <div className="h-full w-70 overflow-y-scroll rounded-md">
      <div className="flex flex-row gap-3 items-center mb-6">
        <div className="bg-green-500 w-3.75 h-3.75 rounded-full"></div>
        <p className="text-secondary-text heading-sm">{title}</p>
      </div>
    </div>
  );
}

export default Column;
