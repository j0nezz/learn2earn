import {lighten} from 'polished';
import React, {
  InputHTMLAttributes,
  ReactNode,
  useCallback,
  useMemo,
  useState
} from 'react';
import styled, {css} from 'styled-components';
import {__ALERTS, __COLORS, __GRAY_SCALE, SPACING} from '../../theme/theme';
import { Icon, IconTypes } from './Icon';
// eslint-disable-next-line import/no-extraneous-dependencies

export enum InputFieldStatus {
  VALID = 'VALID',
  INVALID = 'INVALID',
  DEFAULT = 'DEFAULT'
}

export const getColorFromInputStatus = (status?: InputFieldStatus) => {
  switch (status) {
    case InputFieldStatus.VALID:
      return __ALERTS.SUCCESS;
    case InputFieldStatus.INVALID:
      return __ALERTS.ERROR;
    case InputFieldStatus.DEFAULT:
      return __GRAY_SCALE._600;
    default:
      return __GRAY_SCALE._600;
  }
};

const Container = styled.div<{
  isDisabled?: boolean;
  noMarginBottom?: boolean;
}>`
  display: flex;
  flex-direction: column;
  font-size: 16px;
  flex: 1;
  position: relative;
  margin-bottom: ${p => (p.noMarginBottom ? 0 : SPACING * 1.5)}px;
`;

const InputContainer = styled.div<{
  isOnFocus: boolean;
  isDisabled?: boolean;
}>`
  &:hover {
    background: ${props =>
      props.isDisabled
        ? __GRAY_SCALE._100
        : props.isOnFocus
        ? __COLORS.WHITE
        : lighten(0.75, __COLORS.PRIMARY)};
    border-color: ${props =>
      props.isDisabled
        ? __GRAY_SCALE._200
        : props.isOnFocus
        ? __COLORS.PRIMARY
        : lighten(0.1, __COLORS.PRIMARY)};
  }
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  border-radius: 4px;
  transition: 0.15s ease-in-out all;
  border: 2px solid
    ${props =>
      props.isOnFocus && !props.isDisabled
        ? __COLORS.PRIMARY
        : __GRAY_SCALE._200};
  background: ${props =>
    props.isDisabled ? __GRAY_SCALE._100 : __COLORS.WHITE};
`;
export const inputHeight = '3.5rem';
const inputTopPadding = '0.95rem';

const Label = styled.label<{
  isOnTop: boolean;
  color: string;
  inputLeftPadding: number;
}>`
  position: absolute;
  left: ${props => props.inputLeftPadding}px;
  font-weight: 500;
  top: ${props => (props.isOnTop ? 0.5 : 1)}rem;
  transform-origin: 0px 0px;
  pointer-events: none;
  width: 100%;
  font-size: inherit;
  transform: scale(${props => (props.isOnTop ? 0.75 : 1)});
  display: block;
  white-space: nowrap;
  text-overflow: ellipsis;
  transition: 0.2s cubic-bezier(0.11, 0.98, 0.61, 0.92) all;
  overflow: hidden;
  color: ${props => props.color};
  text-align: left;
`;

const labelMixin = css`
  min-height: ${inputHeight};
  padding-top: ${inputTopPadding};
  padding-bottom: 0px;
  line-height: 1.5;
`;
const noLabelMixin = css`
  padding: ${SPACING}px;
`;
const InputField = styled.input<{inputLeftPadding: number; noLabel?: boolean}>`
  padding-left: ${props => props.inputLeftPadding}px;
  width: 100%;
  font-size: inherit;
  overflow: visible;
  color: ${props => (props.disabled ? __GRAY_SCALE._600 : __GRAY_SCALE._900)};
  text-align: left;
  background: ${'transparent'};
  outline: none !important;
  border: none;
  ${p => (p.noLabel ? noLabelMixin : labelMixin)}
`;

const IconContainer = styled.div<{isVisible: boolean}>`
  position: absolute;
  top: 12px;
  right: ${SPACING * 2}px;
  transition: 0.2s ease-in-out all;
  opacity: ${props => (props.isVisible ? 1 : 0)};
  visibility: ${props => (props.isVisible ? 'visible' : 'hidden')};
`;

const ParentContainer = styled.div`
  display: flex;
  flex: 1;
  position: relative;
`;

export const ValidationContainer = styled.div<{
  isInvalid: boolean;
  inputLeftPadding: number;
}>`
  min-height: 18px;
  padding-left: ${props => props.inputLeftPadding}px;
  color: ${__ALERTS.ERROR};
  opacity: ${props => (props.isInvalid ? 1 : 0)};
  visibility: ${props => (props.isInvalid ? 'visible' : 'hidden')};
  font-size: 12px;
  transition: 0.2s ease-in-out all;
  padding-top: 4px;
  position: ${props => (props.isInvalid ? 'relative' : 'absolute')};
`;

const PrefixInputContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const PrefixContainer = styled.div`
  margin-top: ${inputTopPadding};
`;

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onTextChange?: (v: string) => void;
  value: string | ReactNode;
  placeholder: string;
  status?: InputFieldStatus;
  error?: string;
  name: string;
  prefix?: ReactNode;
  info?: string;
  validation?: boolean;
  noPaddingLeft?: boolean;
  noMarginBottom?: boolean;
  noLabel?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'>;

const getIconName = (status?: InputFieldStatus) => {
  switch (status) {
    case InputFieldStatus.INVALID:
      return IconTypes.ERROR;
    case InputFieldStatus.VALID:
      return IconTypes.CHECK;
    case InputFieldStatus.DEFAULT:
      return '';
    default:
      return '';
  }
};

// eslint-disable-next-line react/display-name
export const Input = React.forwardRef(
  (
    {
      onTextChange,
      value,
      placeholder,
      error,
      status,
      name,
      prefix,
      info,
      validation = true,
      noPaddingLeft,
      noMarginBottom,
      disabled,
      noLabel,
      ...other
    }: Props,
    ref: React.Ref<HTMLInputElement>
  ) => {
    const [onFocus, setOnFocus] = useState<boolean>(false);
    const callback = useCallback(
      e => {
        if (onTextChange) {
          onTextChange(e.target.value);
        }
      },
      [onTextChange]
    );
    const isOnTop = Boolean(onFocus || value || value === 0);
    const inputLeftPadding = noPaddingLeft ? 0 : SPACING * 2;
    const iconName = getIconName(status);
    const color = onFocus ? __GRAY_SCALE._500 : getColorFromInputStatus(status);

    const label = useMemo(
      () => (
        <Label
          isOnTop={isOnTop}
          color={color}
          inputLeftPadding={inputLeftPadding}
        >
          {placeholder}
        </Label>
      ),
      [isOnTop, color, inputLeftPadding, placeholder]
    );

    const validationContainer = useMemo(
      () =>
        validation ? (
          <ValidationContainer
            inputLeftPadding={inputLeftPadding}
            isInvalid={status === InputFieldStatus.INVALID}
          >
            {error}
          </ValidationContainer>
        ) : null,
      [error, inputLeftPadding, status, validation]
    );

    const iconContainer = useMemo(() => {
      return (
        <IconContainer isVisible={status !== InputFieldStatus.DEFAULT}>
          <Icon name={iconName as IconTypes} size={13} color={color} />
        </IconContainer>
      );
    }, [iconName, color, status]);

    return (
      <Container isDisabled={disabled} noMarginBottom={noMarginBottom}>
        <PrefixInputContainer>
          {prefix && <PrefixContainer>{prefix}</PrefixContainer>}
          <ParentContainer>
            <InputContainer isOnFocus={onFocus} isDisabled={disabled}>
              {!noLabel && label}
              <InputField
                ref={ref}
                {...other}
                onChange={callback}
                value={value}
                name={name}
                onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                  setOnFocus(true);
                  other?.onFocus?.(e);
                }}
                disabled={disabled}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  setOnFocus(false);
                  other?.onBlur?.(e);
                }}
                inputLeftPadding={inputLeftPadding}
                noLabel={noLabel}
              />
              {iconContainer}
            </InputContainer>
          </ParentContainer>
        </PrefixInputContainer>
        {validationContainer}
      </Container>
    );
  }
);

export const InputRow = styled.div<{disablemargin?: boolean}>`
  display: flex;
  flex-direction: row;
  margin: ${p => (p.disablemargin ? 0 : `${SPACING * 1.5}px 0`)};
  flex-wrap: wrap;
`;

export const FormSeparator = styled.div`
  width: ${SPACING * 2}px;
  height: ${SPACING * 2}px;
  display: inline-block;
`;
