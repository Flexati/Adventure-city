"""Synthetic validator tests: these are not game/runtime or media review tests."""
import copy
import tempfile
import unittest
from pathlib import Path
from validate_asset_links import validate


class AssetLinkTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.data = {'contents': [{'id': 'test.content', 'required': True,
            'is_new': True, 'status': 'PLANNED', 'asset_ids': ['test.asset']}],
            'assets': [{'id': 'test.asset', 'mode': 'TO_DECIDE', 'status': 'PLANNED'}],
            'audio_briefs': [{'prompt': i, 'status': 'PLANNED', 'asset_ids': []}
                             for i in range(129)]}

    def tearDown(self):
        self.temp.cleanup()

    def test_plan_can_be_valid_without_claiming_media_exists(self):
        self.assertTrue(validate(self.data, self.root)['ok'])
        self.assertFalse(validate(self.data, self.root, True)['ok'])

    def test_content_without_assets_or_unknown_link_is_rejected(self):
        for links in [[], ['missing.asset']]:
            data = copy.deepcopy(self.data)
            data['contents'][0]['asset_ids'] = links
            self.assertFalse(validate(data, self.root)['ok'])

    def test_duplicate_ids_are_rejected(self):
        data = copy.deepcopy(self.data)
        data['assets'].append(copy.deepcopy(data['assets'][0]))
        self.assertFalse(validate(data, self.root)['ok'])

    def test_new_creation_cannot_close_with_only_generic_reuse(self):
        self.data['assets'][0]['mode'] = 'reuse'
        errors = validate(self.data, self.root, True)['errors']
        self.assertTrue(any('no specific new/adapted asset' in e for e in errors))

    def test_missing_files_bad_hash_and_path_escape_are_rejected(self):
        a = self.data['assets'][0]
        a.update(mode='new', status='VERIFIED', runtime_path='missing.svg', sha256='0' * 64)
        self.assertTrue(any('file missing' in e for e in validate(self.data, self.root, True)['errors']))
        (self.root / 'actual.svg').write_text('<svg/>')
        a['runtime_path'] = 'actual.svg'
        self.assertTrue(any('SHA-256 mismatch' in e for e in validate(self.data, self.root, True)['errors']))
        a['runtime_path'] = '../outside.svg'
        self.assertTrue(any('path outside root' in e for e in validate(self.data, self.root, True)['errors']))


if __name__ == '__main__':
    unittest.main()
