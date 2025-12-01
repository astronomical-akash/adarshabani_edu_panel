'use client'

import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

interface FormattingSettings {
    h1: {
        fontSize: string
        fontWeight: string
        color: string
        marginTop: string
        marginBottom: string
    }
    h2: {
        fontSize: string
        fontWeight: string
        color: string
        marginTop: string
        marginBottom: string
    }
    h3: {
        fontSize: string
        fontWeight: string
        color: string
        marginTop: string
        marginBottom: string
    }
    paragraph: {
        fontSize: string
        lineHeight: string
        color: string
        marginBottom: string
    }
    box: {
        backgroundColor: string
        borderColor: string
        borderWidth: string
        padding: string
        borderRadius: string
    }
    list: {
        marginLeft: string
        marginBottom: string
    }
}

const defaultSettings: FormattingSettings = {
    h1: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginTop: '2rem',
        marginBottom: '1rem',
    },
    h2: {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#2a2a2a',
        marginTop: '1.5rem',
        marginBottom: '0.75rem',
    },
    h3: {
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#3a3a3a',
        marginTop: '1rem',
        marginBottom: '0.5rem',
    },
    paragraph: {
        fontSize: '1rem',
        lineHeight: '1.75',
        color: '#4a4a4a',
        marginBottom: '1rem',
    },
    box: {
        backgroundColor: '#f0f9ff',
        borderColor: '#0ea5e9',
        borderWidth: '2px',
        padding: '1rem',
        borderRadius: '0.5rem',
    },
    list: {
        marginLeft: '1.5rem',
        marginBottom: '1rem',
    },
}

interface SettingsPanelProps {
    settings?: FormattingSettings
    onSettingsChange?: (settings: FormattingSettings) => void
}

export function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [currentSettings, setCurrentSettings] = useState<FormattingSettings>(
        settings || defaultSettings
    )

    useEffect(() => {
        if (settings) {
            setCurrentSettings(settings)
        }
    }, [settings])

    const updateSetting = (section: keyof FormattingSettings, key: string, value: string) => {
        const newSettings = {
            ...currentSettings,
            [section]: {
                ...currentSettings[section],
                [key]: value,
            },
        }
        setCurrentSettings(newSettings)
        onSettingsChange?.(newSettings)
    }

    const resetToDefaults = () => {
        setCurrentSettings(defaultSettings)
        onSettingsChange?.(defaultSettings)
    }

    if (!isOpen) {
        return (
            <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 z-50"
            >
                <SettingsIcon className="h-4 w-4 mr-2" />
                Settings
            </Button>
        )
    }

    return (
        <div className="settings-panel">
            <div className="settings-header">
                <h2>Formatting Settings</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <div className="settings-content">
                {/* H1 Settings */}
                <div className="setting-section">
                    <h3>Heading 1 (H1)</h3>
                    <div className="setting-grid">
                        <div>
                            <Label>Font Size</Label>
                            <Input
                                value={currentSettings.h1.fontSize}
                                onChange={(e) => updateSetting('h1', 'fontSize', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Font Weight</Label>
                            <Select
                                value={currentSettings.h1.fontWeight}
                                onValueChange={(v) => updateSetting('h1', 'fontWeight', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="600">Semi-bold</SelectItem>
                                    <SelectItem value="bold">Bold</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Color</Label>
                            <Input
                                type="color"
                                value={currentSettings.h1.color}
                                onChange={(e) => updateSetting('h1', 'color', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* H2 Settings */}
                <div className="setting-section">
                    <h3>Heading 2 (H2)</h3>
                    <div className="setting-grid">
                        <div>
                            <Label>Font Size</Label>
                            <Input
                                value={currentSettings.h2.fontSize}
                                onChange={(e) => updateSetting('h2', 'fontSize', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Font Weight</Label>
                            <Select
                                value={currentSettings.h2.fontWeight}
                                onValueChange={(v) => updateSetting('h2', 'fontWeight', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="600">Semi-bold</SelectItem>
                                    <SelectItem value="bold">Bold</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Color</Label>
                            <Input
                                type="color"
                                value={currentSettings.h2.color}
                                onChange={(e) => updateSetting('h2', 'color', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* H3 Settings */}
                <div className="setting-section">
                    <h3>Heading 3 (H3)</h3>
                    <div className="setting-grid">
                        <div>
                            <Label>Font Size</Label>
                            <Input
                                value={currentSettings.h3.fontSize}
                                onChange={(e) => updateSetting('h3', 'fontSize', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Font Weight</Label>
                            <Select
                                value={currentSettings.h3.fontWeight}
                                onValueChange={(v) => updateSetting('h3', 'fontWeight', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="600">Semi-bold</SelectItem>
                                    <SelectItem value="bold">Bold</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Color</Label>
                            <Input
                                type="color"
                                value={currentSettings.h3.color}
                                onChange={(e) => updateSetting('h3', 'color', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Paragraph Settings */}
                <div className="setting-section">
                    <h3>Paragraph</h3>
                    <div className="setting-grid">
                        <div>
                            <Label>Font Size</Label>
                            <Input
                                value={currentSettings.paragraph.fontSize}
                                onChange={(e) => updateSetting('paragraph', 'fontSize', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Line Height</Label>
                            <Input
                                value={currentSettings.paragraph.lineHeight}
                                onChange={(e) => updateSetting('paragraph', 'lineHeight', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Color</Label>
                            <Input
                                type="color"
                                value={currentSettings.paragraph.color}
                                onChange={(e) => updateSetting('paragraph', 'color', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Box Settings */}
                <div className="setting-section">
                    <h3>Box / Callout</h3>
                    <div className="setting-grid">
                        <div>
                            <Label>Background Color</Label>
                            <Input
                                type="color"
                                value={currentSettings.box.backgroundColor}
                                onChange={(e) => updateSetting('box', 'backgroundColor', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Border Color</Label>
                            <Input
                                type="color"
                                value={currentSettings.box.borderColor}
                                onChange={(e) => updateSetting('box', 'borderColor', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Border Width</Label>
                            <Input
                                value={currentSettings.box.borderWidth}
                                onChange={(e) => updateSetting('box', 'borderWidth', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Padding</Label>
                            <Input
                                value={currentSettings.box.padding}
                                onChange={(e) => updateSetting('box', 'padding', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                <Button onClick={resetToDefaults} variant="outline" className="w-full">
                    Reset to Defaults
                </Button>
            </div>
        </div>
    )
}

export { defaultSettings }
export type { FormattingSettings }
