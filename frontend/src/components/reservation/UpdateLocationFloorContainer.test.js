import { render, screen, fireEvent } from '@testing-library/react';
import UpdateLocationFloorContainer from './UpdateLocationFloorContainer';

test('UpdateLocationFloor renders when pressing + button', async () => {
  render (<UpdateLocationFloorContainer />);
  const addButton = screen.getByText('+');
  fireEvent.click(addButton);
  const floorUpdateComponents = await screen.getAllByTestId('update-location-floor');
  expect(floorUpdateComponents).toHaveLength(2);
});