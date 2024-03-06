import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import React from 'react';
// import UserPage from '../client/Components/UserPage';

  describe('A button', () => {
    test('the button has text content', () => {
      render(
        <>
          <button>
            I is a button
          </button>
        </>
      );
      expect(screen.getByRole('button')).toHaveTextContent('I is a button');
    });
  });


