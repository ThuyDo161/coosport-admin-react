import {
  ColorSwatch,
  Group,
  Select as SelectMantine,
  SelectProps,
  Text,
} from "@mantine/core";
import { forwardRef } from "react";

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  value: string;
  label: string;
}

interface SelectPropsI extends SelectProps {
  hasColor?: boolean;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ value, label, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <span className={`badge bg-${value}`}></span>
        <Text size="sm">{label}</Text>
      </Group>
    </div>
  )
);

const Select = (props: SelectPropsI) => {
  return (
    <SelectMantine
      {...props}
      itemComponent={props.hasColor ? SelectItem : undefined}
      maxDropdownHeight={400}
      clearable
      nothingFound="Nobody here"
    />
  );
};

export default Select;
