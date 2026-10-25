import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

import numpy as np
import soundfile as sf
from PIL import Image

spec = importlib.util.spec_from_file_location('v10_audit', Path(__file__).with_name('audit.py'))
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)

class AuditTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)

    def tearDown(self):
        self.temp.cleanup()

    def test_missing_empty_and_escape_are_rejected(self):
        (self.root/'empty').touch()
        for value in ['missing', 'empty', '../escape', '']:
            with self.assertRaises(ValueError):
                audit.safe_file(self.root, value)

    def test_invalid_json_is_rejected(self):
        p = self.root/'bad.json'; p.write_text('{')
        with self.assertRaises(json.JSONDecodeError):
            audit.inspect(p)

    def atlas(self, **changes):
        Image.new('RGBA', (16,8), (1,2,3,255)).save(self.root/'sheet.png')
        data = {'frameWidth':8,'frameHeight':8,'columns':2,'rows':1,'pivot':[4,8],
            'animations':{'idle':{'row':0,'frames':2}}}
        data.update(changes)
        p = self.root/'sheet.json'; p.write_text(json.dumps(data)); return p

    def test_broken_atlas_dimensions_are_rejected(self):
        with self.assertRaises(ValueError): audit.inspect(self.atlas(columns=3))

    def test_out_of_bounds_animation_and_pivot_are_rejected(self):
        with self.assertRaises(ValueError): audit.inspect(self.atlas(pivot=[-1,8]))
        with self.assertRaises(ValueError): audit.inspect(self.atlas(animations={'idle':{'row':1,'frames':2}}))

    def test_duplicate_frames_and_missing_player_states_are_reported(self):
        result = audit.inspect(self.atlas())
        self.assertEqual(result['duplicate_frames']['idle'],1)
        self.assertIn('death', result['missing_player_states'])

    def test_oversized_texture_is_reported(self):
        p = self.root/'large.png'; Image.new('RGBA',(2049,2)).save(p)
        self.assertTrue(audit.inspect(p)['oversized'])

    def test_audio_metrics_do_not_claim_listening_pass(self):
        p = self.root/'tone.ogg'
        sf.write(p,np.sin(np.arange(4410)*.05)*.2,44100,format='OGG',subtype='VORBIS')
        result = audit.inspect(p)
        self.assertEqual(result['clipped_samples'],0)
        self.assertEqual(result['auditory_qa'],'NOT_TESTED')
        self.assertAlmostEqual(result['duration'],.1)

    def test_corrupt_reference_image_and_zip_are_rejected(self):
        for name in ['reference.webp','reference.zip']:
            p = self.root/name; p.write_bytes(b'not a valid reference')
            with self.assertRaises(Exception): audit.inspect(p)

if __name__ == '__main__': unittest.main()
