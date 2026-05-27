import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

const SPECIES_EMOJI: Record<string, string> = { dog: '🐶', cat: '🐱' };

export default async function TagPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  // Look up the tag → pet
  const { data: tag } = await supabase
    .from('smart_tags')
    .select('pet_id, status')
    .eq('qr_code', code)
    .eq('status', 'activated')
    .single();

  let pet: { name: string; breed: string | null; species: string; avatar_url: string | null; color: string | null } | null = null;
  let ownerName: string | null = null;

  if (tag?.pet_id) {
    const { data: petData } = await supabase
      .from('pets')
      .select('name, breed, species, avatar_url, color, owner_id')
      .eq('id', tag.pet_id)
      .single();

    if (petData) {
      pet = petData;
      const { data: owner } = await supabase
        .from('user_profiles')
        .select('display_name, username')
        .eq('id', (petData as any).owner_id)
        .single();
      ownerName = owner?.display_name ?? owner?.username ?? null;
    }
  }

  const found = !!pet;

  return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', padding: '24px 16px' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Header badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'white', borderRadius: 99, padding: '8px 18px',
            border: '1px solid #bae6fd', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}>
            <span style={{ fontSize: 16 }}>🐾</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#6495ED', letterSpacing: 0.3 }}>Chewie Smart Tag</span>
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: 'white', borderRadius: 28,
          boxShadow: '0 4px 24px rgba(100,149,237,0.12)',
          overflow: 'hidden',
        }}>
          {found && pet ? (
            <>
              {/* Pet photo */}
              {pet.avatar_url ? (
                <img
                  src={pet.avatar_url}
                  alt={pet.name}
                  style={{ width: '100%', height: 280, objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div style={{
                  width: '100%', height: 220,
                  background: 'linear-gradient(135deg, #e0eaff 0%, #f0f4ff 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 96 }}>{SPECIES_EMOJI[pet.species] ?? '🐾'}</span>
                </div>
              )}

              {/* Pet info */}
              <div style={{ padding: '20px 24px 24px' }}>
                <h1 style={{ margin: '0 0 4px', fontSize: 30, fontWeight: 800, color: '#0f172a', letterSpacing: -0.5 }}>
                  {pet.name}
                </h1>
                {(pet.breed ?? pet.species) && (
                  <p style={{ margin: '0 0 14px', fontSize: 15, color: '#64748b', fontWeight: 500 }}>
                    {pet.breed ?? pet.species}{pet.color ? ` · ${pet.color}` : ''}
                  </p>
                )}

                {/* Chips */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  <span style={chipStyle}>{SPECIES_EMOJI[pet.species] ?? '🐾'} {pet.species === 'dog' ? 'Dog' : 'Cat'}</span>
                  {pet.breed && <span style={chipStyle}>{pet.breed}</span>}
                </div>

                {/* Owner */}
                {ownerName && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: '#f0f9ff', borderRadius: 12, padding: '10px 14px',
                    marginBottom: 20, border: '1px solid #bae6fd',
                  }}>
                    <span style={{ fontSize: 16 }}>👤</span>
                    <span style={{ fontSize: 13, color: '#3368D0' }}>
                      Owned by <strong>{ownerName}</strong>
                    </span>
                  </div>
                )}

                {/* Thanks card */}
                <div style={{
                  background: '#f0fdf4', borderRadius: 18, padding: 20,
                  textAlign: 'center', border: '1px solid #bbf7d0', marginBottom: 16,
                }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>🙏</div>
                  <p style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 700, color: '#0f172a' }}>
                    Thank you for scanning!
                  </p>
                  <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
                    If {pet.name} looks lost or is in distress, download Chewie to help reunite them with their owner.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <a href="https://apps.apple.com/app/chewie" style={primaryBtnStyle}>
                    🍎 Download on the App Store
                  </a>
                  <a href="https://play.google.com/store/apps/details?id=com.chewieapp.app" style={{ ...primaryBtnStyle, background: '#1a1a2e' }}>
                    ▶ Get it on Google Play
                  </a>
                </div>
              </div>
            </>
          ) : (
            /* Not found / not activated */
            <div style={{ padding: '48px 28px', textAlign: 'center' }}>
              <div style={{ fontSize: 72, marginBottom: 16 }}>🏷️</div>
              <h1 style={{ margin: '0 0 10px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>
                Set up your pet profile
              </h1>
              <p style={{ margin: '0 0 6px', fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
                This tag hasn't been activated yet.
              </p>
              <p style={{ margin: '0 0 28px', fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>
                Tag ID: <code style={{ background: '#f1f5f9', padding: '2px 7px', borderRadius: 6, fontSize: 12, color: '#334155' }}>{code}</code>
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 8 }}>
                <a href="https://apps.apple.com/app/chewie" style={primaryBtnStyle}>
                  🍎 Download on the App Store
                </a>
                <a href="https://play.google.com/store/apps/details?id=com.chewieapp.app" style={{ ...primaryBtnStyle, background: '#1a1a2e' }}>
                  ▶ Get it on Google Play
                </a>
              </div>
              <p style={{ marginTop: 12, fontSize: 12, color: '#cbd5e1', textAlign: 'center' }}>
                Open Chewie → My Tags → Activate to link this tag to your pet.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 20 }}>
          Powered by <strong style={{ color: '#6495ED' }}>Chewie</strong> — Lost & Found for your pets
        </p>
      </div>
    </main>
  );
}

const chipStyle: React.CSSProperties = {
  background: '#f1f5f9', borderRadius: 99,
  padding: '5px 13px', fontSize: 12,
  fontWeight: 600, color: '#334155',
  border: '1px solid #e2e8f0',
};

const primaryBtnStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  gap: 8, height: 52, borderRadius: 16,
  background: '#6495ED', color: 'white',
  fontSize: 16, fontWeight: 700, textDecoration: 'none',
  boxShadow: '0 4px 14px rgba(100,149,237,0.35)',
};
