"use client";

import styled, { css } from "styled-components";

export const PageContainer = styled.div`
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;

  @media (max-width: 640px) {
    width: min(100% - 28px, 1120px);
  }
`;

export const Eyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #2563eb;
  font-size: 0.74rem;
  font-weight: 750;
  letter-spacing: 0.11em;
  text-transform: uppercase;
`;

export const Pill = styled.span<{ $tone?: "blue" | "neutral" }>`
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 5px 10px;
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1.2;

  ${({ $tone = "neutral" }) =>
    $tone === "blue"
      ? css`
          color: #1d4ed8;
          background: #eff6ff;
        `
      : css`
          color: #475569;
          background: #f1f5f9;
        `}
`;

export const ActionButton = styled.button<{ $quiet?: boolean }>`
  display: inline-flex;
  min-height: 40px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid ${({ $quiet }) => ($quiet ? "#dbe4f0" : "#1d4ed8")};
  border-radius: 10px;
  padding: 0 14px;
  color: ${({ $quiet }) => ($quiet ? "#334155" : "#fff")};
  background: ${({ $quiet }) => ($quiet ? "#fff" : "#2563eb")};
  font: inherit;
  font-size: 0.86rem;
  font-weight: 650;
  cursor: pointer;
  transition:
    background 160ms ease,
    border-color 160ms ease,
    transform 160ms ease;

  &:hover:not(:disabled) {
    border-color: #1d4ed8;
    background: ${({ $quiet }) => ($quiet ? "#eff6ff" : "#1d4ed8")};
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 3px solid #93c5fd;
    outline-offset: 2px;
  }

  &:disabled {
    cursor: wait;
    opacity: 0.65;
  }
`;

export const IconButton = styled.button`
  display: inline-grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  color: #475569;
  background: #fff;
  cursor: pointer;

  &:hover {
    color: #1d4ed8;
    background: #eff6ff;
  }

  &:focus-visible {
    outline: 3px solid #93c5fd;
    outline-offset: 2px;
  }
`;
