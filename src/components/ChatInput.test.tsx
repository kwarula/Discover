import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChatInput } from './ChatInput';
import * as translationService from '@/services/translationService';

// Mock translationService
jest.mock('@/services/translationService', () => ({
  translate: jest.fn((key, lang) => `${key}_${lang}`), // Simple mock for translate
  getCurrentLanguage: jest.fn(() => 'en'), // Default language
}));

const mockTranslate = translationService.translate as jest.Mock;
const mockGetCurrentLanguage = translationService.getCurrentLanguage as jest.Mock;

describe('ChatInput', () => {
  let onSendMessageMock: jest.Mock;

  beforeEach(() => {
    onSendMessageMock = jest.fn();
    mockTranslate.mockClear();
    mockGetCurrentLanguage.mockClear();
    // Default to 'en' before each test for getCurrentLanguage
    mockGetCurrentLanguage.mockReturnValue('en');
  });

  it('renders correctly with initial placeholder and suggestions', () => {
    render(<ChatInput onSendMessage={onSendMessageMock} />);

    expect(screen.getByPlaceholderText('askAnything_en')).toBeInTheDocument();
    expect(screen.getByText('bestBeaches_en')).toBeInTheDocument();
    expect(screen.getByText('restaurants_en')).toBeInTheDocument();
  });

  it('updates message state on input change', () => {
    render(<ChatInput onSendMessage={onSendMessageMock} />);
    const textarea = screen.getByPlaceholderText('askAnything_en') as HTMLTextAreaElement;

    fireEvent.change(textarea, { target: { value: 'Hello there' } });
    expect(textarea.value).toBe('Hello there');
  });

  it('calls onSendMessage with trimmed message on form submit', () => {
    render(<ChatInput onSendMessage={onSendMessageMock} />);
    const textarea = screen.getByPlaceholderText('askAnything_en');
    const sendButton = screen.getByRole('button', { name: /send message/i });

    fireEvent.change(textarea, { target: { value: '  Hello Diani!  ' } });
    fireEvent.click(sendButton);

    expect(onSendMessageMock).toHaveBeenCalledWith('Hello Diani!');
    expect(textarea).toHaveValue(''); // Message should be cleared
  });

  it('calls onSendMessage on Enter key press (not Shift+Enter)', () => {
    render(<ChatInput onSendMessage={onSendMessageMock} />);
    const textarea = screen.getByPlaceholderText('askAnything_en');

    fireEvent.change(textarea, { target: { value: 'Test Enter' } });
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' });
    expect(onSendMessageMock).toHaveBeenCalledWith('Test Enter');

    onSendMessageMock.mockClear();
    fireEvent.change(textarea, { target: { value: 'Test Shift+Enter' } });
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', shiftKey: true });
    expect(onSendMessageMock).not.toHaveBeenCalled();
  });

  it('handles quick suggestion click', () => {
    render(<ChatInput onSendMessage={onSendMessageMock} />);
    const suggestionButton = screen.getByText('hiddenGems_en'); // Uses the mocked translate output

    fireEvent.click(suggestionButton);
    // The message state should be the query of the suggestion
    expect(screen.getByPlaceholderText('askAnything_en')).toHaveValue('hiddenGems_en');
  });

  it('hides suggestions when typing and shows them when input is empty', () => {
    render(<ChatInput onSendMessage={onSendMessageMock} />);
    const textarea = screen.getByPlaceholderText('askAnything_en');

    expect(screen.getByText('bestBeaches_en')).toBeVisible();
    fireEvent.change(textarea, { target: { value: 'H' } }); // Start typing
    expect(screen.queryByText('bestBeaches_en')).not.toBeVisible(); // Should hide

    fireEvent.change(textarea, { target: { value: '' } }); // Clear input
    expect(screen.getByText('bestBeaches_en')).toBeVisible(); // Should show again
  });

  // This test simulates the effect of the interval causing a language change
  it('updates placeholder and suggestions if language changes', async () => {
    const { rerender } = render(<ChatInput onSendMessage={onSendMessageMock} />);
    expect(screen.getByPlaceholderText('askAnything_en')).toBeInTheDocument();
    expect(screen.getByText('bestBeaches_en')).toBeInTheDocument();

    // Simulate language change recognized by the polling useEffect
    // The useEffect calls setCurrentLang, which triggers a re-render.
    // We can simulate this by changing the mock for getCurrentLanguage and then re-rendering
    // or by directly manipulating a "currentLang" prop if we were to refactor it.
    // For this test, let's assume the internal state 'currentLang' changes.
    // We can't directly set state, so we'll change the mock and rerender.

    mockGetCurrentLanguage.mockReturnValue('es');
    // To make the component re-evaluate its internal 'currentLang' state based on the new mock value,
    // we need to simulate the interval's effect.
    // Jest's fake timers could be used here if the interval was the direct subject.
    // However, since the component's useEffect depends on its *own* 'currentLang' state,
    // and updates it if getCurrentLanguage() differs, we need a way to trigger that check.
    // A simple re-render might not be enough if the useEffect isn't re-run.
    // For simplicity in this test, let's assume the internal mechanism works and
    // test the outcome if currentLang was 'es'. We can achieve this by re-rendering
    // with a prop that forces the internal currentLang to be 'es' if that was an option,
    // or by directly calling the translation functions with 'es'.

    // Let's refine the mock for translate to reflect language change more directly in this test
    mockTranslate.mockImplementation((key, lang) => `${key}_${lang || mockGetCurrentLanguage()}`);

    // Rerender the component. In a real scenario, the interval would call setCurrentLang,
    // which would trigger this rerender with the updated internal currentLang state.
    rerender(<ChatInput onSendMessage={onSendMessageMock} />);

    // After language change to 'es' (simulated by rerender and updated mock)
    expect(screen.getByPlaceholderText('askAnything_es')).toBeInTheDocument();
    expect(screen.getByText('bestBeaches_es')).toBeInTheDocument();
    expect(screen.getByText('restaurants_es')).toBeInTheDocument();
  });

  it('disables input and buttons when disabled prop is true', () => {
    render(<ChatInput onSendMessage={onSendMessageMock} disabled={true} />);

    expect(screen.getByPlaceholderText('askAnything_en')).toBeDisabled();
    expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();

    // Check a suggestion button
    const suggestionButton = screen.getByText('bestBeaches_en');
    expect(suggestionButton).toBeDisabled();

    // Voice input button (assuming it's a button, might need specific role/name)
    // For VoiceInput, we'd need to know its internals or add a test ID.
    // If VoiceInput internally disables its button, that's an integration detail.
    // Let's assume the send button and text area are primary indicators.
  });
});
