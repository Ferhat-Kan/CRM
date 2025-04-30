import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Chip,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

interface InviteUsersModalProps {
  open: boolean;
  onClose: () => void;
  onSend: (emails: string[], message: string) => Promise<void>;
}

export default function InviteUsersModal({
  open,
  onClose,
  onSend,
}: InviteUsersModalProps) {
  const [emails, setEmails] = useState<string[]>(['']);
  const [message, setMessage] = useState<string>('');
  const [sending, setSending] = useState(false);

  const handleEmailChange = (idx: number, val: string) => {
    const copy = [...emails];
    copy[idx] = val;
    setEmails(copy);
  };

  const addEmailField = () => setEmails([...emails, '']);

  const removeEmail = (idx: number) => {
    setEmails(emails.filter((_, i) => i !== idx));
  };

  const handleSend = async () => {
    setSending(true);
    await onSend(
      emails.filter((e) => e.trim()),
      message
    );
    setSending(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Invite Users
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          {emails.map((email, idx) => (
            <Stack direction="row" spacing={1} key={idx} alignItems="center">
              <TextField
                label={`Email ${idx + 1}`}
                fullWidth
                value={email}
                onChange={(e) => handleEmailChange(idx, e.target.value)}
                placeholder="user@example.com"
              />
              {emails.length > 1 && (
                <IconButton color="error" onClick={() => removeEmail(idx)}>
                  <CloseIcon />
                </IconButton>
              )}
            </Stack>
          ))}
          <Button startIcon={<AddIcon />} onClick={addEmailField}>
            Add another email
          </Button>
          <TextField
            label="Message (optional)"
            multiline
            minRows={3}
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={sending}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={sending || !emails.some((e) => e.trim())}
        >
          {sending ? 'Sending…' : 'Send'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
