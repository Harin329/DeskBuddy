import { render, screen } from '@testing-library/react';
import App from './App';

test('renders DeskBuddy title', () => {
  render(<App />);
  const linkElement = screen.getByText('Welcome to DeskBuddy');
  expect(linkElement).toBeInTheDocument();
});
