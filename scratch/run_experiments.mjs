import { evaluateConfig } from './test_fixes.mjs';

const configA = `
/* Config A: Responsive font size + balanced asymmetric indents + mobile wrapping */
.asymmetric-statement {
  font-size: clamp(34px, 5.2vw, 76px) !important;
  line-height: 0.94 !important;
  max-width: 100% !important;
}

.statement-line-mask.mask-row-2 {
  margin-left: clamp(1.25rem, 3.5vw, 4.5rem) !important;
}

.statement-line-mask.mask-row-3 {
  margin-left: clamp(2rem, 5vw, 6.5rem) !important;
}

.statement-line-mask {
  overflow: hidden !important;
  max-width: 100% !important;
}

.statement-row {
  display: block !important;
}

@media (max-width: 900px) {
  .asymmetric-statement {
    font-size: clamp(28px, 5.5vw, 48px) !important;
    line-height: 0.98 !important;
  }
  .statement-line-mask.mask-row-2,
  .statement-line-mask.mask-row-3 {
    margin-left: 0 !important;
  }
  .statement-row.row-3 {
    white-space: normal !important;
    word-break: normal !important;
  }
}

@media (max-width: 480px) {
  .asymmetric-statement {
    font-size: clamp(24px, 6.5vw, 32px) !important;
    line-height: 1.02 !important;
  }
  .statement-row.row-3 {
    white-space: normal !important;
  }
}
`;

const configB = `
/* Config B: Maximum scale (78px) with optimized 4vw indent + wrap on tablet/mobile */
.asymmetric-statement {
  font-size: clamp(34px, 5.4vw, 78px) !important;
  line-height: 0.93 !important;
  max-width: 100% !important;
}

.statement-line-mask.mask-row-2 {
  margin-left: clamp(1rem, 2.8vw, 3.8rem) !important;
}

.statement-line-mask.mask-row-3 {
  margin-left: clamp(1.5rem, 4.2vw, 5.5rem) !important;
}

.statement-line-mask {
  overflow: hidden !important;
  max-width: 100% !important;
}

@media (max-width: 900px) {
  .asymmetric-statement {
    font-size: clamp(28px, 5.2vw, 46px) !important;
    line-height: 0.98 !important;
  }
  .statement-line-mask.mask-row-2,
  .statement-line-mask.mask-row-3 {
    margin-left: 0 !important;
  }
  .statement-row.row-3 {
    white-space: normal !important;
  }
}

@media (max-width: 480px) {
  .asymmetric-statement {
    font-size: clamp(22px, 6.2vw, 30px) !important;
    line-height: 1.04 !important;
  }
  .statement-row.row-3 {
    white-space: normal !important;
  }
}
`;

async function main() {
  await evaluateConfig(configA, 'configA');
  await evaluateConfig(configB, 'configB');
}

main().catch(console.error);
