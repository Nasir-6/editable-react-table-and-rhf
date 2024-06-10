// import viteLogo from "/vite.svg";
import React from "react";
import "./App.css";

import mockData from "./mockData.json";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  RowData,
  flexRender,
} from "@tanstack/react-table";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";

type TDateTime = {
  date: string;
  time1: string;
  time2: string;
  time3: string;
  time4: string;
};

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

// Give our default column cell renderer editing superpowers!
// useFormContext along with react-tables - cell row/columns to grab the values!!
const defaultColumn: Partial<ColumnDef<TDateTime>> = {
  cell: ({ row: { index }, column: { id } }) => {
    const { getValues } = useFormContext();
    const defaultValue = getValues()["myData"][index][id];

    return (
      <>
        <Controller
          name={`myData.${index}.${id}`}
          defaultValue={defaultValue}
          // rules={{ required: { value: true, message: "field is required" } }}
          render={({ field }) => <input {...field} />}
        />
        {/* {errors?.myData?.[index]?.[id].message} */}
      </>
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

  const [data, setData] = React.useState(mockData);

  const formMethods = useForm({
    defaultValues: {
      myData: data, // !NOTE: This name is used everywhere - look into how to get rid of it
    },
  });

  const onSubmit = (data: { myData: TDateTime[] }) => console.log(data);

  const { fields } = useFieldArray({
    control: formMethods.control,
    name: "myData", // !NOTE: This name is used everywhere - look into how to get rid of it
  });

  const table = useReactTable({
    data: fields, // pass in fields from rhf to link up!
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    // Provide our updateData function to our table meta
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
    debugTable: true,
  });

  return (
    <div className="w-screen flex flex-col items-center justify-center">
      <h1 className=" text-red-500">TEST</h1>
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <table>
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
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
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
