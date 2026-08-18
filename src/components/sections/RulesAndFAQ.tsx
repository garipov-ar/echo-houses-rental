'use client';

import React, { useState } from 'react';
import { RULES, FAQ_ITEMS } from '../../data/faqRulesData';
import { Clock, ShieldAlert, VolumeX, Dog, CigaretteOff, ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';
import styles from './RulesAndFAQ.module.css';

const ICON_MAP: Record<string, React.ReactNode> = {
  Clock: <Clock size={24} />,
  ShieldAlert: <ShieldAlert size={24} />,
  VolumeX: <VolumeX size={24} />,
  Dog: <Dog size={24} />,
  CigaretteOff: <CigaretteOff size={24} />,
};

export const RulesAndFAQ: React.FC = () => {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIdx(openFaqIdx === index ? null : index);
  };

  return (
    <section className="section" id="rules" style={{ backgroundColor: '#0B0F0C' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-title-wrapper">
          <span className="section-tag">
            <ShieldCheck size={14} />
            Условия и частые вопросы
          </span>
          <h2 className="section-heading">Правила проживания и FAQ</h2>
          <p className="section-subtitle">
            Простые и понятные правила для комфортного, безопасного и уважительного отдыха каждого нашего гостя.
          </p>
        </div>

        {/* Rules Grid */}
        <div className={styles.rulesGrid}>
          {RULES.map((rule, idx) => (
            <div key={idx} className={styles.ruleCard}>
              <div className={styles.ruleIconWrap}>
                {ICON_MAP[rule.icon] || <Clock size={24} />}
              </div>
              <h4 className={styles.ruleTitle}>{rule.title}</h4>
              <p className={styles.ruleDesc}>{rule.description}</p>
            </div>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className={styles.faqWrapper}>
          <h3 className={styles.faqHeading}>
            <HelpCircle size={20} className={styles.helpIcon} />
            Ответы на частые вопросы:
          </h3>

          <div className={styles.accordionList}>
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div key={idx} className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ''}`}>
                  <button
                    className={styles.faqQuestionBtn}
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                  >
                    <span className={styles.faqQuestion}>{item.question}</span>
                    <div className={styles.faqChevronWrap}>
                      <ChevronDown
                        size={18}
                        className={`${styles.chevron} ${isOpen ? styles.chevronRotated : ''}`}
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className={styles.faqAnswerWrap}>
                      <p className={styles.faqAnswer}>{item.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
