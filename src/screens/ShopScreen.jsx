import React from 'react';
import { P } from '../constants.js';

export function ShopScreen({ coins, items, onBuy, onTogglePlaced }) {
  const owned   = items.filter(i =>  i.owned);
  const forSale = items.filter(i => !i.owned);

  const Section = ({ title, children }) => (
    <>
      <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, fontWeight: 700, color: P.muted, letterSpacing: 2.5, textTransform: 'uppercase', padding: '18px 16px 10px' }}>{title}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 16px' }}>{children}</div>
    </>
  );

  const OwnedCard = ({ item }) => (
    <div style={{ background: P.white, borderRadius: 20, padding: '16px 12px 14px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', position: 'relative' }}>
      <div style={{ fontSize: 30, marginBottom: 8 }}>{item.icon}</div>
      <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, fontWeight: 700, color: P.ink, marginBottom: 12 }}>{item.label}</div>
      <button
        onClick={() => onTogglePlaced(item)}
        style={{ background: item.placed ? P.terra : 'oklch(90% 0.025 140)', color: item.placed ? 'white' : 'oklch(36% 0.09 140)', border: 'none', borderRadius: 12, padding: '7px 14px', fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s', width: '100%' }}>
        {item.placed ? 'Placed ✓' : 'Hidden'}
      </button>
    </div>
  );

  const ShopCard = ({ item }) => {
    const canBuy = coins >= item.cost;
    return (
      <div style={{ background: P.white, borderRadius: 20, padding: '16px 12px 14px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 30, marginBottom: 8 }}>{item.icon}</div>
        <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, fontWeight: 700, color: P.ink, marginBottom: 10 }}>{item.label}</div>
        <button
          onClick={() => onBuy(item)}
          disabled={!canBuy}
          style={{ background: canBuy ? P.terra : 'oklch(88% 0.03 50)', color: canBuy ? 'white' : P.muted, border: 'none', borderRadius: 12, padding: '7px 14px', fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 700, cursor: canBuy ? 'pointer' : 'not-allowed', display: 'inline-flex', alignItems: 'center', gap: 4, transition: 'all 0.15s', width: '100%', justifyContent: 'center' }}>
          <span style={{ fontSize: 11 }}>🪙</span>{item.cost}
        </button>
      </div>
    );
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 24 }}>
      <div style={{ padding: '20px 22px 18px', background: P.white }}>
        <div style={{ fontFamily: '"DM Serif Display", serif', fontStyle: 'italic', fontSize: 14, color: P.muted }}>spend your coins</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <span style={{ fontSize: 24 }}>🪙</span>
          <span style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 32, color: P.ink }}>{coins}</span>
        </div>
      </div>

      {owned.length > 0 && (
        <Section title="In your nest">
          {owned.map(item => <OwnedCard key={item.id} item={item} />)}
        </Section>
      )}

      {forSale.length > 0 && (
        <Section title="Shop">
          {forSale.map(item => <ShopCard key={item.id} item={item} />)}
        </Section>
      )}
    </div>
  );
}
