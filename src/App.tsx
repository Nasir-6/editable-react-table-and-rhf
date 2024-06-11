// import viteLogo from "/vite.svg";
import React from "react";
import "./App.css";

import mockData from "./mockData.json";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import {
  DateTimeSchema,
  FormDataType,
  TDateTime,
  dataName,
} from "./types/schema";

import { zodResolver } from "@hookform/resolvers/zod";
import TooltipInput from "./TooltipInput";

// !Note: No need for updateData TableMeta - as rhf is now controlling the state!
// declare module "@tanstack/react-table" {
//   interface TableMeta<TData extends RowData> {
//     updateData: (rowIndex: number, columnId: string, value: unknown) => void;
//   }
// }

// Give our default column cell renderer editing superpowers!
// useFormContext along with react-tables - cell row/columns to grab the values!!
const defaultColumn: Partial<ColumnDef<TDateTime>> = {
  cell: ({
    cell: { id: cellId },
    row: { index },
    column: { id: columnId },
  }) => {
    const {
      getValues,
      formState: { errors },
    } = useFormContext<FormDataType>();
    const defaultValue = getValues()[dataName][index][columnId];
    const errMsg = errors?.[dataName]?.[index]?.[columnId]?.message;

    return (
      <td key={cellId} className={`${errMsg && " border-2 border-red-500"}`}>
        <Controller
          name={`${dataName}.${index}.${columnId}`}
          defaultValue={defaultValue}
          render={({ field }) => (
            <TooltipInput content={errMsg}>
              <input {...field} />
            </TooltipInput>
          )}
        />
      </td>
    );
  },
};

function App() {
  const columns: ColumnDef<TDateTime>[] = React.useMemo(
    () => [
      {
        header: "Date",
        accessorKey: "date",
      },
      {
        header: "First Time",
        accessorKey: "time1",
      },
      {
        header: "Second Time",
        accessorKey: "time2",
      },
      {
        header: "Third Time",
        accessorKey: "time3",
      },
      {
        header: "Fourth Time",
        accessorKey: "time4",
      },
    ],
    []
  );

  const [data] = React.useState(mockData); // Can replace this with reactQuery for data! setData no longer needed as rhf deals with state!

  const formMethods = useForm({
    defaultValues: {
      [dataName]: data, // !NOTE: This name is used everywhere - look into how to get rid of it
    },
    resolver: zodResolver(DateTimeSchema),
    mode: "onBlur",
    reValidateMode: "onBlur", // This is the validation mode after submit - set to onblur to prevent rerendering during typing in an input
  });

  const onSubmit = (data: FormDataType) => console.log(data);

  // Using fieldArray as the table/form is dynamic - plus we want to keep track of all the dates/rows in their own object in a massive array
  // Have access to add/remove functions (desctructure like fields if you need it)
  const { fields } = useFieldArray({
    control: formMethods.control,
    name: dataName, // !NOTE: This name is used everywhere - look into how to get rid of it
  });

  const table = useReactTable({
    data: fields, // pass in fields from rhf to link up!
    columns,
    defaultColumn, // columns where cell is not defined uses defaultColumn! - which is the editable field in this case
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
  });

  return (
    <div className="w-screen flex flex-col items-center justify-center">
      <h1 className=" text-red-500">TEST</h1>
      <FormProvider {...formMethods}>
        {/* Use FormProvider so can access rhf hooks/methods in nested components via useFormContext - avoids prop drilling!*/}
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          {/* form cannot be a child of table - so do this way */}
          <table className="border border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => {
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <>
                          {/* Use flexRender so can render an input fields (with tooltips) - rather than just text */}
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <input type="submit" />
        </form>
      </FormProvider>
    </div>
  );
}

export default App;
