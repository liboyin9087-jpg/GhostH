/**
 * Object asset paths (CUTOUT + FOUND)
 *
 * Naming rule: obj_XX_slug
 * - CUTOUT (transparent PNG): /assets/objects/cutout/<id>.png
 * - FOUND (JPG/PNG):         /assets/objects/found/<id>.jpg
 *
 * Notes:
 * - obj_09_burnt_docs uses two found variants (..._01 / ..._02).
 */

export type ObjectId =
  | "obj_01_wheelchair"
  | "obj_02_flashlight"
  | "obj_03_vhs"
  | "obj_04_cam_battery"
  | "obj_05_morgue_handle"
  | "obj_06_evidence_box"
  | "obj_07_emergency_button"
  | "obj_08_audio_reel"
  | "obj_09_burnt_docs"
  | "obj_10_ash_pile"
  | "obj_11_cctv"
  | "obj_12_old_key"
  | "obj_13_wristband"
  | "obj_14_photo"
  | "obj_15_mirror"
  | "obj_16_medical_tool"
  | "obj_17_blood_stain"
  | "obj_18_tapeplayer"
  | "obj_19_stretcher"
  | "obj_20_wheelbed"
  | "obj_21_eyedrops"
  | "obj_22_lockerdoor"
  | "obj_23_mirrorfragment"
  | "obj_24_bloodbag"
  | "obj_25_eeghelmet"
  | "obj_26_wallcorner"
  | "obj_27_hospitalcurtain"
  | "obj_28_ceilinglamp"
  | "obj_29_bedsidetable"
  | "obj_30_ctscanphoto";

export type ObjectMedia = {
  cutout: string;  // PNG alpha
  found: string[]; // 1+ variants
};

export const OBJECT_MEDIA: Record<ObjectId, ObjectMedia> = {
  obj_01_wheelchair: { cutout: "/assets/objects/cutout/obj_01_wheelchair.png", found: ["/assets/objects/found/obj_01_wheelchair.jpg"] },
  obj_02_flashlight: { cutout: "/assets/objects/cutout/obj_02_flashlight.png", found: ["/assets/objects/found/obj_02_flashlight.jpg"] },
  obj_03_vhs: { cutout: "/assets/objects/cutout/obj_03_vhs.png", found: ["/assets/objects/found/obj_03_vhs.jpg"] },
  obj_04_cam_battery: { cutout: "/assets/objects/cutout/obj_04_cam_battery.png", found: ["/assets/objects/found/obj_04_cam_battery.jpg"] },
  obj_05_morgue_handle: { cutout: "/assets/objects/cutout/obj_05_morgue_handle.png", found: ["/assets/objects/found/obj_05_morgue_handle.jpg"] },
  obj_06_evidence_box: { cutout: "/assets/objects/cutout/obj_06_evidence_box.png", found: ["/assets/objects/found/obj_06_evidence_box.jpg"] },
  obj_07_emergency_button: { cutout: "/assets/objects/cutout/obj_07_emergency_button.png", found: ["/assets/objects/found/obj_07_emergency_button.jpg"] },
  obj_08_audio_reel: { cutout: "/assets/objects/cutout/obj_08_audio_reel.png", found: ["/assets/objects/found/obj_08_audio_reel.jpg"] },
  obj_09_burnt_docs: { cutout: "/assets/objects/cutout/obj_09_burnt_docs.png", found: ["/assets/objects/found/obj_09_burnt_docs_01.jpg", "/assets/objects/found/obj_09_burnt_docs_02.jpg"] },
  obj_10_ash_pile: { cutout: "/assets/objects/cutout/obj_10_ash_pile.png", found: ["/assets/objects/found/obj_10_ash_pile.jpg"] },
  obj_11_cctv: { cutout: "/assets/objects/cutout/obj_11_cctv.png", found: ["/assets/objects/found/obj_11_cctv.jpg"] },
  obj_12_old_key: { cutout: "/assets/objects/cutout/obj_12_old_key.png", found: ["/assets/objects/found/obj_12_old_key.jpg"] },
  obj_13_wristband: { cutout: "/assets/objects/cutout/obj_13_wristband.png", found: ["/assets/objects/found/obj_13_wristband.jpg"] },
  obj_14_photo: { cutout: "/assets/objects/cutout/obj_14_photo.png", found: ["/assets/objects/found/obj_14_photo.jpg"] },
  obj_15_mirror: { cutout: "/assets/objects/cutout/obj_15_mirror.png", found: ["/assets/objects/found/obj_15_mirror.jpg"] },
  obj_16_medical_tool: { cutout: "/assets/objects/cutout/obj_16_medical_tool.png", found: ["/assets/objects/found/obj_16_medical_tool.jpg"] },
  obj_17_blood_stain: { cutout: "/assets/objects/cutout/obj_17_blood_stain.png", found: ["/assets/objects/found/obj_17_blood_stain.jpg"] },
  obj_18_tapeplayer: { cutout: "/assets/objects/cutout/obj_18_tapeplayer.png", found: ["/assets/objects/found/obj_18_tapeplayer.jpg"] },
  obj_19_stretcher: { cutout: "/assets/objects/cutout/obj_19_stretcher.png", found: ["/assets/objects/found/obj_19_stretcher.jpg"] },
  obj_20_wheelbed: { cutout: "/assets/objects/cutout/obj_20_wheelbed.png", found: ["/assets/objects/found/obj_20_wheelbed.jpg"] },
  obj_21_eyedrops: { cutout: "/assets/objects/cutout/obj_21_eyedrops.png", found: ["/assets/objects/found/obj_21_eyedrops.jpg"] },
  obj_22_lockerdoor: { cutout: "/assets/objects/cutout/obj_22_lockerdoor.png", found: ["/assets/objects/found/obj_22_lockerdoor.jpg"] },
  obj_23_mirrorfragment: { cutout: "/assets/objects/cutout/obj_23_mirrorfragment.png", found: ["/assets/objects/found/obj_23_mirrorfragment.jpg"] },
  obj_24_bloodbag: { cutout: "/assets/objects/cutout/obj_24_bloodbag.png", found: ["/assets/objects/found/obj_24_bloodbag.jpg"] },
  obj_25_eeghelmet: { cutout: "/assets/objects/cutout/obj_25_eeghelmet.png", found: ["/assets/objects/found/obj_25_eeghelmet.jpg"] },
  obj_26_wallcorner: { cutout: "/assets/objects/cutout/obj_26_wallcorner.png", found: ["/assets/objects/found/obj_26_wallcorner.jpg"] },
  obj_27_hospitalcurtain: { cutout: "/assets/objects/cutout/obj_27_hospitalcurtain.png", found: ["/assets/objects/found/obj_27_hospitalcurtain.jpg"] },
  obj_28_ceilinglamp: { cutout: "/assets/objects/cutout/obj_28_ceilinglamp.png", found: ["/assets/objects/found/obj_28_ceilinglamp.jpg"] },
  obj_29_bedsidetable: { cutout: "/assets/objects/cutout/obj_29_bedsidetable.png", found: ["/assets/objects/found/obj_29_bedsidetable.jpg"] },
  obj_30_ctscanphoto: { cutout: "/assets/objects/cutout/obj_30_ctscanphoto.png", found: ["/assets/objects/found/obj_30_ctscanphoto.jpg"] },
};

export function getObjectMedia(id: ObjectId): ObjectMedia {
  return OBJECT_MEDIA[id];
}
