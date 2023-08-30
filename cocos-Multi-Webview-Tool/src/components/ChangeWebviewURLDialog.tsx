import React, {MouseEventHandler, useRef} from 'react';
import {Button, Dialog, DialogActions, DialogContent, TextField} from "@mui/material";

export type ChangeWebviewUrlDialogProps = {
    open: boolean
    onClose: MouseEventHandler
    onOk: (url: string) => void
}

const ChangeWebviewUrlDialog: React.FC<ChangeWebviewUrlDialogProps> = (props) => {
    const defaultURLValue = localStorage.getItem("cocos-url") || "https://storage.googleapis.com/ww-cocos/waywin_index.html";
    const urlInputRef = useRef<HTMLInputElement>();

    const handleOK = () => {
        props.onOk(urlInputRef.current!.value.trim())
    }

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
        >
            <DialogContent sx={{width: 500}}>
                <TextField
                    inputRef={urlInputRef}
                    defaultValue={defaultURLValue}
                    autoFocus
                    id="url"
                    label="網址"
                    type="url"
                    fullWidth
                    variant="standard"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>取消</Button>
                <Button onClick={handleOK}>確定</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ChangeWebviewUrlDialog;
