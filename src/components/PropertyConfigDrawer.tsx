import { useState } from 'react';
import { Plus, RotateCcw, Trash2, X } from 'lucide-react';
import {
  DEFAULT_RESORT_CONFIG,
  RESORT_PHOTOS,
  ROOM_CATEGORIES,
  ResortConfig,
  RoomCategoryId,
} from '../data/resortData';

interface PropertyConfigDrawerProps {
  open: boolean;
  config: ResortConfig;
  onUpdateConfig: (next: ResortConfig) => void;
  onClose: () => void;
}

export function PropertyConfigDrawer({
  open,
  config,
  onUpdateConfig,
  onClose,
}: PropertyConfigDrawerProps) {
  const [newAmenityInputs, setNewAmenityInputs] = useState<Record<RoomCategoryId, string>>({
    deluxe: '',
    executive: '',
    presidential: '',
  });

  if (!open) return null;

  const roomPhotos = RESORT_PHOTOS.filter((p) => p.category !== 'Exterior');

  const handleRoomMappingChange = (roomId: RoomCategoryId, photoId: string) => {
    onUpdateConfig({
      ...config,
      roomImageMapping: {
        ...config.roomImageMapping,
        [roomId]: photoId,
      },
    });
  };

  const handleToggleAmenity = (amenityId: string) => {
    onUpdateConfig({
      ...config,
      amenities: config.amenities.map((item) =>
        item.id === amenityId ? { ...item, confirmed: !item.confirmed } : item
      ),
    });
  };

  const handleAmenityNote = (amenityId: string, note: string) => {
    onUpdateConfig({
      ...config,
      amenities: config.amenities.map((item) =>
        item.id === amenityId ? { ...item, note } : item
      ),
    });
  };

  const handleAddRoomAmenity = (roomId: RoomCategoryId) => {
    const val = newAmenityInputs[roomId].trim();
    if (!val) return;
    const current = config.roomVerifiedAmenities[roomId] ?? [];
    if (current.includes(val)) return;
    onUpdateConfig({
      ...config,
      roomVerifiedAmenities: {
        ...config.roomVerifiedAmenities,
        [roomId]: [...current, val],
      },
    });
    setNewAmenityInputs((prev) => ({ ...prev, [roomId]: '' }));
  };

  const handleRemoveRoomAmenity = (roomId: RoomCategoryId, item: string) => {
    onUpdateConfig({
      ...config,
      roomVerifiedAmenities: {
        ...config.roomVerifiedAmenities,
        [roomId]: (config.roomVerifiedAmenities[roomId] ?? []).filter((x) => x !== item),
      },
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="property-config-title"
      className="fixed inset-0 z-50 flex justify-end bg-[#181715]/65 backdrop-blur-sm"
    >
      <div className="h-full w-full max-w-xl overflow-y-auto bg-[#F8F5EF] dark:bg-[#181715] border-l border-[#C5A46D]/30 p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#242424]/10 dark:border-[#F8F5EF]/10">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#A4834C] dark:text-[#C5A46D]">
              Editable Resort Configuration
            </p>
            <h2
              id="property-config-title"
              className="font-serif text-2xl sm:text-3xl font-medium text-[#242424] dark:text-[#F8F5EF] mt-1"
            >
              Property Setup &amp; Mapping
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close property setup"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#242424]/15 dark:border-[#F8F5EF]/15 text-[#242424] dark:text-[#F8F5EF] hover:border-[#C5A46D]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-8">
          {/* 1. Room Image Mapping */}
          <section aria-labelledby="config-room-mapping">
            <h3
              id="config-room-mapping"
              className="font-serif text-xl font-medium text-[#242424] dark:text-[#F8F5EF] mb-1.5"
            >
              1. Room Category Photo Mapping
            </h3>
            <p className="text-xs text-[#242424]/70 dark:text-[#F8F5EF]/70 mb-4 leading-relaxed">
              Match each uploaded room photograph to its verified room tier. Changes update the
              Rooms &amp; Suites cards and detail views immediately.
            </p>

            <div className="space-y-4">
              {ROOM_CATEGORIES.map((room) => {
                const selectedPhotoId = config.roomImageMapping[room.id];
                const selectedPhoto =
                  roomPhotos.find((p) => p.id === selectedPhotoId) ?? roomPhotos[0];

                return (
                  <div
                    key={room.id}
                    className="rounded-xl bg-[#FFFFFF] dark:bg-[#242424] border border-[#242424]/10 dark:border-[#F8F5EF]/10 p-4 flex items-center gap-4"
                  >
                    <img
                      src={selectedPhoto.src}
                      alt={selectedPhoto.title}
                      className="h-16 w-20 shrink-0 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <label
                        htmlFor={`map-room-${room.id}`}
                        className="block text-sm font-semibold text-[#242424] dark:text-[#F8F5EF] mb-1.5"
                      >
                        {room.name}
                      </label>
                      <select
                        id={`map-room-${room.id}`}
                        value={selectedPhotoId}
                        onChange={(e) => handleRoomMappingChange(room.id, e.target.value)}
                        className="w-full rounded-md border border-[#242424]/20 dark:border-[#F8F5EF]/20 bg-[#F8F5EF] dark:bg-[#181715] px-3 py-2 text-xs text-[#242424] dark:text-[#F8F5EF] focus:border-[#C5A46D] focus:outline-none"
                      >
                        {roomPhotos.map((photo) => (
                          <option key={photo.id} value={photo.id}>
                            {photo.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 2. Contact & WhatsApp Configuration */}
          <section
            aria-labelledby="config-contact"
            className="pt-6 border-t border-[#242424]/10 dark:border-[#F8F5EF]/10"
          >
            <h3
              id="config-contact"
              className="font-serif text-xl font-medium text-[#242424] dark:text-[#F8F5EF] mb-1.5"
            >
              2. WhatsApp &amp; Contact Information
            </h3>
            <p className="text-xs text-[#242424]/70 dark:text-[#F8F5EF]/70 mb-4 leading-relaxed">
              Supply verified resort contact channels. Blank fields remain unadvertised rather than
              showing placeholder numbers.
            </p>

            <div className="space-y-3.5">
              <div>
                <label
                  htmlFor="cfg-whatsapp"
                  className="block text-xs font-medium text-[#242424]/80 dark:text-[#F8F5EF]/80 mb-1"
                >
                  Official WhatsApp Number (with country code)
                </label>
                <input
                  id="cfg-whatsapp"
                  type="tel"
                  placeholder="e.g. +234 800 000 0000"
                  value={config.whatsappNumber}
                  onChange={(e) =>
                    onUpdateConfig({ ...config, whatsappNumber: e.target.value })
                  }
                  className="w-full rounded-md border border-[#242424]/20 dark:border-[#F8F5EF]/20 bg-[#FFFFFF] dark:bg-[#242424] px-3 py-2.5 text-sm text-[#242424] dark:text-[#F8F5EF] focus:border-[#C5A46D] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="cfg-phone"
                  className="block text-xs font-medium text-[#242424]/80 dark:text-[#F8F5EF]/80 mb-1"
                >
                  Front Desk Phone
                </label>
                <input
                  id="cfg-phone"
                  type="tel"
                  placeholder="Optional verified phone"
                  value={config.contactPhone}
                  onChange={(e) =>
                    onUpdateConfig({ ...config, contactPhone: e.target.value })
                  }
                  className="w-full rounded-md border border-[#242424]/20 dark:border-[#F8F5EF]/20 bg-[#FFFFFF] dark:bg-[#242424] px-3 py-2.5 text-sm text-[#242424] dark:text-[#F8F5EF] focus:border-[#C5A46D] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="cfg-email"
                  className="block text-xs font-medium text-[#242424]/80 dark:text-[#F8F5EF]/80 mb-1"
                >
                  Reservations Email
                </label>
                <input
                  id="cfg-email"
                  type="email"
                  placeholder="Optional verified email"
                  value={config.contactEmail}
                  onChange={(e) =>
                    onUpdateConfig({ ...config, contactEmail: e.target.value })
                  }
                  className="w-full rounded-md border border-[#242424]/20 dark:border-[#F8F5EF]/20 bg-[#FFFFFF] dark:bg-[#242424] px-3 py-2.5 text-sm text-[#242424] dark:text-[#F8F5EF] focus:border-[#C5A46D] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="cfg-address"
                  className="block text-xs font-medium text-[#242424]/80 dark:text-[#F8F5EF]/80 mb-1"
                >
                  Resort Address
                </label>
                <input
                  id="cfg-address"
                  type="text"
                  placeholder="Optional verified property address"
                  value={config.resortAddress}
                  onChange={(e) =>
                    onUpdateConfig({ ...config, resortAddress: e.target.value })
                  }
                  className="w-full rounded-md border border-[#242424]/20 dark:border-[#F8F5EF]/20 bg-[#FFFFFF] dark:bg-[#242424] px-3 py-2.5 text-sm text-[#242424] dark:text-[#F8F5EF] focus:border-[#C5A46D] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="cfg-maps-query"
                  className="block text-xs font-medium text-[#242424]/80 dark:text-[#F8F5EF]/80 mb-1"
                >
                  Google Maps Location / Coordinates Query
                </label>
                <input
                  id="cfg-maps-query"
                  type="text"
                  placeholder="Optional place name or lat,lng for Google Map embed"
                  value={config.googleMapsQuery}
                  onChange={(e) =>
                    onUpdateConfig({ ...config, googleMapsQuery: e.target.value })
                  }
                  className="w-full rounded-md border border-[#242424]/20 dark:border-[#F8F5EF]/20 bg-[#FFFFFF] dark:bg-[#242424] px-3 py-2.5 text-sm text-[#242424] dark:text-[#F8F5EF] focus:border-[#C5A46D] focus:outline-none"
                />
              </div>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="cfg-ig"
                    className="block text-xs font-medium text-[#242424]/80 dark:text-[#F8F5EF]/80 mb-1"
                  >
                    Instagram URL
                  </label>
                  <input
                    id="cfg-ig"
                    type="url"
                    placeholder="https://instagram.com/..."
                    value={config.socialLinks.instagram}
                    onChange={(e) =>
                      onUpdateConfig({
                        ...config,
                        socialLinks: { ...config.socialLinks, instagram: e.target.value },
                      })
                    }
                    className="w-full rounded-md border border-[#242424]/20 dark:border-[#F8F5EF]/20 bg-[#FFFFFF] dark:bg-[#242424] px-3 py-2 text-xs text-[#242424] dark:text-[#F8F5EF] focus:border-[#C5A46D] focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="cfg-fb"
                    className="block text-xs font-medium text-[#242424]/80 dark:text-[#F8F5EF]/80 mb-1"
                  >
                    Facebook URL
                  </label>
                  <input
                    id="cfg-fb"
                    type="url"
                    placeholder="https://facebook.com/..."
                    value={config.socialLinks.facebook}
                    onChange={(e) =>
                      onUpdateConfig({
                        ...config,
                        socialLinks: { ...config.socialLinks, facebook: e.target.value },
                      })
                    }
                    className="w-full rounded-md border border-[#242424]/20 dark:border-[#F8F5EF]/20 bg-[#FFFFFF] dark:bg-[#242424] px-3 py-2 text-xs text-[#242424] dark:text-[#F8F5EF] focus:border-[#C5A46D] focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="cfg-x"
                    className="block text-xs font-medium text-[#242424]/80 dark:text-[#F8F5EF]/80 mb-1"
                  >
                    X (Twitter) URL
                  </label>
                  <input
                    id="cfg-x"
                    type="url"
                    placeholder="https://x.com/..."
                    value={config.socialLinks.x}
                    onChange={(e) =>
                      onUpdateConfig({
                        ...config,
                        socialLinks: { ...config.socialLinks, x: e.target.value },
                      })
                    }
                    className="w-full rounded-md border border-[#242424]/20 dark:border-[#F8F5EF]/20 bg-[#FFFFFF] dark:bg-[#242424] px-3 py-2 text-xs text-[#242424] dark:text-[#F8F5EF] focus:border-[#C5A46D] focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="cfg-tiktok"
                    className="block text-xs font-medium text-[#242424]/80 dark:text-[#F8F5EF]/80 mb-1"
                  >
                    TikTok URL
                  </label>
                  <input
                    id="cfg-tiktok"
                    type="url"
                    placeholder="https://tiktok.com/@..."
                    value={config.socialLinks.tiktok}
                    onChange={(e) =>
                      onUpdateConfig({
                        ...config,
                        socialLinks: { ...config.socialLinks, tiktok: e.target.value },
                      })
                    }
                    className="w-full rounded-md border border-[#242424]/20 dark:border-[#F8F5EF]/20 bg-[#FFFFFF] dark:bg-[#242424] px-3 py-2 text-xs text-[#242424] dark:text-[#F8F5EF] focus:border-[#C5A46D] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 3. Verified Resort Amenities */}
          <section
            aria-labelledby="config-amenities"
            className="pt-6 border-t border-[#242424]/10 dark:border-[#F8F5EF]/10"
          >
            <h3
              id="config-amenities"
              className="font-serif text-xl font-medium text-[#242424] dark:text-[#F8F5EF] mb-1.5"
            >
              3. Verified Resort Amenities
            </h3>
            <p className="text-xs text-[#242424]/70 dark:text-[#F8F5EF]/70 mb-4 leading-relaxed">
              Enable only amenities that are officially confirmed on-property.
            </p>

            <div className="space-y-3">
              {config.amenities.map((amenity) => (
                <div
                  key={amenity.id}
                  className="rounded-lg bg-[#FFFFFF] dark:bg-[#242424] border border-[#242424]/10 dark:border-[#F8F5EF]/10 p-3.5"
                >
                  <label className="flex items-center justify-between gap-3 cursor-pointer">
                    <span className="text-sm font-medium text-[#242424] dark:text-[#F8F5EF]">
                      {amenity.name}
                    </span>
                    <input
                      type="checkbox"
                      checked={amenity.confirmed}
                      onChange={() => handleToggleAmenity(amenity.id)}
                      className="h-4 w-4 accent-[#C5A46D]"
                    />
                  </label>

                  {amenity.confirmed && (
                    <input
                      type="text"
                      placeholder={`Verified details for ${amenity.name}...`}
                      value={amenity.note}
                      onChange={(e) => handleAmenityNote(amenity.id, e.target.value)}
                      className="mt-2.5 w-full rounded-md border border-[#242424]/15 dark:border-[#F8F5EF]/15 bg-[#F8F5EF] dark:bg-[#181715] px-3 py-1.5 text-xs text-[#242424] dark:text-[#F8F5EF] focus:border-[#C5A46D] focus:outline-none"
                    />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 4. Per-Room Verified Amenities */}
          <section
            aria-labelledby="config-room-amenities"
            className="pt-6 border-t border-[#242424]/10 dark:border-[#F8F5EF]/10"
          >
            <h3
              id="config-room-amenities"
              className="font-serif text-xl font-medium text-[#242424] dark:text-[#F8F5EF] mb-1.5"
            >
              4. Per-Room Verified Amenities
            </h3>
            <p className="text-xs text-[#242424]/70 dark:text-[#F8F5EF]/70 mb-4 leading-relaxed">
              Add confirmed inclusions shown inside each room&apos;s View Details modal.
            </p>

            <div className="space-y-4">
              {ROOM_CATEGORIES.map((room) => {
                const items = config.roomVerifiedAmenities[room.id] ?? [];
                return (
                  <div
                    key={room.id}
                    className="rounded-lg bg-[#FFFFFF] dark:bg-[#242424] border border-[#242424]/10 dark:border-[#F8F5EF]/10 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#A4834C] dark:text-[#C5A46D] mb-2">
                      {room.name}
                    </p>

                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        aria-label={`Add verified amenity for ${room.name}`}
                        placeholder="Add confirmed inclusion..."
                        value={newAmenityInputs[room.id]}
                        onChange={(e) =>
                          setNewAmenityInputs((prev) => ({
                            ...prev,
                            [room.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddRoomAmenity(room.id);
                          }
                        }}
                        className="flex-1 rounded-md border border-[#242424]/15 dark:border-[#F8F5EF]/15 bg-[#F8F5EF] dark:bg-[#181715] px-3 py-1.5 text-xs text-[#242424] dark:text-[#F8F5EF] focus:border-[#C5A46D] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddRoomAmenity(room.id)}
                        aria-label={`Add amenity to ${room.name}`}
                        className="inline-flex items-center gap-1 rounded-md bg-[#242424] dark:bg-[#C5A46D] px-3 py-1.5 text-xs font-medium text-[#F8F5EF] dark:text-[#181715]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add</span>
                      </button>
                    </div>

                    {items.length > 0 && (
                      <ul className="space-y-1.5">
                        {items.map((item) => (
                          <li
                            key={item}
                            className="flex items-center justify-between gap-2 text-xs text-[#242424]/85 dark:text-[#F8F5EF]/85"
                          >
                            <span>{item}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveRoomAmenity(room.id, item)}
                              aria-label={`Remove ${item} from ${room.name}`}
                              className="text-[#242424]/50 dark:text-[#F8F5EF]/50 hover:text-red-600 dark:hover:text-red-400"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Reset Footer */}
          <div className="pt-6 border-t border-[#242424]/10 dark:border-[#F8F5EF]/10 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => onUpdateConfig(structuredClone(DEFAULT_RESORT_CONFIG))}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#242424]/70 dark:text-[#F8F5EF]/70 hover:text-[#242424] dark:hover:text-[#F8F5EF]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Configuration</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-[#242424] dark:bg-[#C5A46D] px-5 py-2.5 text-xs font-semibold tracking-wider uppercase text-[#F8F5EF] dark:text-[#181715]"
            >
              Save &amp; Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
