/**
 * Object media manifest (obj_01 ~ obj_17)
 * Put images in /public/assets/objects/...
 */
export const OBJECT_MEDIA = {
  obj_01_wheelchair: {
    cutout: '/assets/objects/cutout/obj_01_wheelchair.png',
    found: '/assets/objects/found/obj_01_wheelchair_found.jpg',
  },
  obj_02_flashlight: {
    cutout: '/assets/objects/cutout/obj_02_flashlight.png',
    found: '/assets/objects/found/obj_02_flashlight_found.jpg',
  },
  obj_03_vhs: {
    cutout: '/assets/objects/cutout/obj_03_vhs.png',
    found: '/assets/objects/found/obj_03_vhs_found.jpg',
  },
  obj_04_cam_battery: {
    cutout: '/assets/objects/cutout/obj_04_cam_battery.png',
    found: '/assets/objects/found/obj_04_cam_battery_found.jpg',
  },
  obj_05_morgue_handle: {
    cutout: '/assets/objects/cutout/obj_05_morgue_handle.png',
    found: '/assets/objects/found/obj_05_morgue_handle_found.jpg',
  },
  obj_06_evidence_box: {
    cutout: '/assets/objects/cutout/obj_06_evidence_box.png',
    found: '/assets/objects/found/obj_06_evidence_box_found.jpg',
  },
  obj_07_emergency_button: {
    cutout: '/assets/objects/cutout/obj_07_emergency_button.png',
    found: '/assets/objects/found/obj_07_emergency_button_found.jpg',
  },
  obj_08_audio_reel: {
    cutout: '/assets/objects/cutout/obj_08_audio_reel.png',
    found: '/assets/objects/found/obj_08_audio_reel_found.jpg',
  },
  obj_09_burnt_docs: {
    cutout: '/assets/objects/cutout/obj_09_burnt_docs.png',
    found: '/assets/objects/found/obj_09_burnt_docs_found.jpg',
  },
  obj_10_ash_pile: {
    cutout: '/assets/objects/cutout/obj_10_ash_pile.png',
    found: '/assets/objects/found/obj_10_ash_pile_found.jpg',
  },
  obj_11_cctv: {
    cutout: '/assets/objects/cutout/obj_11_cctv.png',
    found: '/assets/objects/found/obj_11_cctv_found.jpg',
  },
  obj_12_old_key: {
    cutout: '/assets/objects/cutout/obj_12_old_key.png',
    found: '/assets/objects/found/obj_12_old_key_found.jpg',
  },
  obj_13_wristband: {
    cutout: '/assets/objects/cutout/obj_13_wristband.png',
    found: '/assets/objects/found/obj_13_wristband_found.jpg',
  },
  obj_14_photo: {
    cutout: '/assets/objects/cutout/obj_14_photo.png',
    found: '/assets/objects/found/obj_14_photo_found.jpg',
  },
  obj_15_mirror: {
    cutout: '/assets/objects/cutout/obj_15_mirror.png',
    found: '/assets/objects/found/obj_15_mirror_found.jpg',
  },
  obj_16_medical_tool: {
    cutout: '/assets/objects/cutout/obj_16_medical_tool.png',
    found: '/assets/objects/found/obj_16_medical_tool_found.jpg',
  },
  obj_17_blood_stain: {
    cutout: '/assets/objects/cutout/obj_17_blood_stain.png',
    found: '/assets/objects/found/obj_17_blood_stain_found.jpg',
  },
} as const;

export type ObjectId = keyof typeof OBJECT_MEDIA;
