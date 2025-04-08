import { GridView } from '@/types/search';

const AscendingIcon = () => (
  <svg
    // @ts-expect-error
    slot="prefix"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.33333 4.7619L4.25984 5.68841L6.60714 3.33929V11.3095H7.61905V3.33929L9.96627 5.68841L10.8929 4.7619L6.96429 0.833333L3.33333 4.7619Z"
      fill="currentColor"
    />
    <path
      opacity="0.3"
      d="M17.0833 15.2381L16.1568 14.3116L13.8095 16.6607V8.69048H12.7976V16.6607L10.4504 14.3116L9.52381 15.2381L13.4524 19.1667L17.0833 15.2381Z"
      fill="currentColor"
    />
  </svg>
);

const DescendingIcon = () => (
  <svg
    // @ts-expect-error
    slot="prefix"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.3"
      d="M3.33333 4.7619L4.25984 5.68841L6.60714 3.33929V11.3095H7.61905V3.33929L9.96627 5.68841L10.8929 4.7619L6.96429 0.833333L3.33333 4.7619Z"
      fill="currentColor"
    />
    <path
      d="M17.0833 15.2381L16.1568 14.3116L13.8095 16.6607V8.69048H12.7976V16.6607L10.4504 14.3116L9.52381 15.2381L13.4524 19.1667L17.0833 15.2381Z"
      fill="currentColor"
    />
  </svg>
);

export const sortDirections = [{
  label: 'Ascending',
  value: 'ascending',
  icon: AscendingIcon,
}, {
  label: 'Descending',
  value: 'descending',
  icon: DescendingIcon,
}];

export const views = [{
  value: GridView.Small,
  label: 'Small labeled',
}, {
  value: GridView.Medium,
  label: 'Medium labeled',
}, {
  value: GridView.Large,
  label: 'Large labeled',
}];