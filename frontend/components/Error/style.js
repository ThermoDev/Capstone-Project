import styled from 'styled-components';

export const FillSpaceError = styled.div`
  display: flex;
  flex: auto;
  background: white;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  align-self: stretch;
  text-align: center;
  border-radius: 12px;
  padding: ${props => (props.small ? '16px 12px' : '32px 24px')};
`;

export const LargeImage = styled.img`
  display: block;
  height: 100%;
  width: ${props => (props.small ? '200px' : '400px')};
  margin-bottom: ${props => (props.small ? '16px' : '24px')};
`;

export const Heading = styled.h3`
  font-size: ${props => (props.small ? '18px' : '24px')};
  font-weight: ${props => (props.small ? '500' : '600')};
  color: ${({ theme }) => theme.black};
  max-width: 600px;
  margin-bottom: 8px;
`;

export const Subheading = styled.h4`
  font-size: ${props => (props.small ? '14px' : '18px')};
  font-weight: ${props => (props.small ? '400' : '500')};
  line-height: 1.4;
  color: ${({ theme }) => theme.grey};
  max-width: 540px;
  margin-bottom: ${props => (props.small ? '16px' : '32px')};
`;
