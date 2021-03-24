import { render, screen,fireEvent } from '@testing-library/react';
import UpdateLocationFloor from './UpdateLocationFloor';

const floors = [
  {
      value: 1,
      label: '1',
  },
  {
      value: 2,
      label: '2',
  },
  {
      value: 3,
      label: '3',
  },
  {
      value: 4,
      label: '4',
  },
];

test('All floor options appear when pressing floor dropdown menu', () => {
  render(<UpdateLocationFloor />);
  const dropDownBox = screen.getByTestId('update-location-floor-dropdown');
  fireEvent.click(dropDownBox);
  floors.map((floor) => {
    const menuItem = screen.getByTestId(floor.label);
    expect(menuItem).toBeTruthy();
  })
});

test('Pressing Update Existing Floor Plan button triggers image uploader', () => {
  const { container } = render(<UpdateLocationFloor />);
  expect(container.getElementsByClassName('fileUploader').length).toBe(1);
});

test('Pressing Remove Existing Floor Plan button changes its color', () => {
  const { container } = render(<UpdateLocationFloor />);
  const removeFloorPlanButton = screen.getByText('Remove Currently Existing Floor Plan');
  fireEvent.click(removeFloorPlanButton);
  expect(container.getElementsByClassName('selectedAttachmentButton').length).toBe(1);
});