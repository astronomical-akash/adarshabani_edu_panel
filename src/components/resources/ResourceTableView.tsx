'use client'

import { useState, useEffect } from "react"
import { getClasses, getSubjectsByClass, getSubjectDetails, getLayers } from "@/actions/hierarchy"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, Circle, CircleDot, CircleDashed } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ResourceForm } from "./ResourceForm"

type Layer = {
    id: string
    name: string
}

type TopicRow = {
    topicId: string
    topicTitle: string
    subtopicId: string | null
    subtopicTitle: string | null
    chapterTitle: string
    layerStatuses: Record<string, 'empty' | 'partial' | 'complete'>
    requiredLayerIds?: string[]
}

export function ResourceTableView() {
    const [classes, setClasses] = useState<any[]>([])
    const [subjects, setSubjects] = useState<any[]>([])
    const [layers, setLayers] = useState<Layer[]>([])
    const [selectedClass, setSelectedClass] = useState<string>("")
    const [selectedSubject, setSelectedSubject] = useState<string>("")
    const [topicRows, setTopicRows] = useState<TopicRow[]>([])
    const [loading, setLoading] = useState(false)

    // Resource form dialog state
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedRow, setSelectedRow] = useState<{
        topicId: string
        subtopicId: string | null
        layerId: string
        chapterTitle: string
        topicTitle: string
        subtopicTitle: string | null
        layerName: string
    } | null>(null)

    // Load classes and layers on mount
    useEffect(() => {
        getClasses().then(setClasses)
        getLayers().then(setLayers)
    }, [])

    // Load subjects when class changes
    useEffect(() => {
        if (selectedClass) {
            getSubjectsByClass(selectedClass).then(setSubjects)
            setSelectedSubject("")
            setTopicRows([])
        }
    }, [selectedClass])

    // Load topics and build table when subject changes
    useEffect(() => {
        if (selectedSubject) {
            loadTopicsTable()
        }
    }, [selectedSubject])

    async function loadTopicsTable() {
        setLoading(true)
        try {
            const subjectData: any = await getSubjectDetails(selectedSubject)
            if (!subjectData) return

            const rows: TopicRow[] = []

            for (const chapter of subjectData.chapters) {
                for (const topic of chapter.topics) {
                    // Add row for topic itself
                    const layerStatuses: Record<string, 'empty' | 'partial' | 'complete'> = {}
                    const topicRequiredLayerIds = topic.requiredLayers?.map((l: any) => l.id) || []

                    for (const layer of layers) {
                        // Check if topic has resources for this layer
                        const hasResource = topic.resources?.some((r: any) => r.layerId === layer.id)
                        layerStatuses[layer.id] = hasResource ? 'complete' : 'empty'
                    }

                    rows.push({
                        topicId: topic.id,
                        topicTitle: topic.title,
                        subtopicId: null,
                        subtopicTitle: null,
                        chapterTitle: chapter.title,
                        layerStatuses,
                        requiredLayerIds: topicRequiredLayerIds
                    })

                    // Add rows for each subtopic
                    for (const subtopic of topic.subtopics) {
                        const subtopicLayerStatuses: Record<string, 'empty' | 'partial' | 'complete'> = {}
                        const requiredLayerIds = subtopic.requiredLayers?.map((l: any) => l.id) || []

                        for (const layer of layers) {
                            // Check if subtopic has resources for this layer
                            const hasResource = subtopic.resources?.some((r: any) => r.layerId === layer.id)
                            subtopicLayerStatuses[layer.id] = hasResource ? 'complete' : 'empty'
                        }

                        rows.push({
                            topicId: topic.id,
                            topicTitle: topic.title,
                            subtopicId: subtopic.id,
                            subtopicTitle: subtopic.title,
                            chapterTitle: chapter.title,
                            layerStatuses: subtopicLayerStatuses,
                            requiredLayerIds
                        })
                    }
                }
            }

            setTopicRows(rows)
        } catch (error) {
            console.error("Error loading topics:", error)
        } finally {
            setLoading(false)
        }
    }

    function openResourceDialog(row: TopicRow, layerId: string) {
        const layer = layers.find(l => l.id === layerId)
        setSelectedRow({
            topicId: row.topicId,
            subtopicId: row.subtopicId,
            layerId: layerId,
            chapterTitle: row.chapterTitle,
            topicTitle: row.topicTitle,
            subtopicTitle: row.subtopicTitle,
            layerName: layer?.name || ''
        })
        setDialogOpen(true)
    }

    function viewResources(row: TopicRow, layerId: string) {
        // Switch to browse tab and filter
        const tabs = document.querySelector('[role="tablist"]');
        if (tabs) {
            const browseTab = tabs.querySelector('[value="browse"]') as HTMLElement;
            if (browseTab) browseTab.click();
        }
    }

    function getStatusIcon(status: 'empty' | 'partial' | 'complete') {
        switch (status) {
            case 'empty':
                return <Circle className="h-4 w-4 text-gray-300" />
            case 'partial':
                return <CircleDashed className="h-4 w-4 text-yellow-500" />
            case 'complete':
                return <CircleDot className="h-4 w-4 text-green-500" />
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Select Class and Subject</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Class</label>
                            <Select value={selectedClass} onValueChange={setSelectedClass}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map(c => (
                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">Subject</label>
                            <Select
                                value={selectedSubject}
                                onValueChange={setSelectedSubject}
                                disabled={!subjects.length}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subjects.map(s => (
                                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {selectedSubject && (
                <Card className="overflow-hidden border-2">
                    <CardHeader className="bg-muted/30 pb-4">
                        <CardTitle>Resource Management Matrix</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="text-center py-12">Loading...</div>
                        ) : topicRows.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                No topics found for this subject
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                                            <TableHead className="w-[150px] font-bold">Chapter</TableHead>
                                            <TableHead className="w-[200px] font-bold">Topic</TableHead>
                                            <TableHead className="w-[200px] font-bold">Subtopic</TableHead>
                                            {layers.map(layer => (
                                                <TableHead key={layer.id} className="text-center min-w-[120px] font-bold">
                                                    {layer.name}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {topicRows.map((row, idx) => (
                                            <TableRow key={idx} className="hover:bg-muted/30 transition-colors">
                                                <TableCell className="font-medium text-muted-foreground">{row.chapterTitle}</TableCell>
                                                <TableCell className="font-medium">{row.topicTitle}</TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {row.subtopicTitle ? (
                                                        <span className="flex items-center gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                                            {row.subtopicTitle}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-300 italic">Main Topic</span>
                                                    )}
                                                </TableCell>
                                                {layers.map(layer => {
                                                    const hasSubtopic = !!row.subtopicId

                                                    // Check if layer is required
                                                    let isRequired = true
                                                    if (row.requiredLayerIds && row.requiredLayerIds.length > 0) {
                                                        isRequired = row.requiredLayerIds.includes(layer.id)
                                                    } else {
                                                        // Fallback legacy logic if no specific requirements set
                                                        const isDiagnostic = layer.name.toLowerCase().includes('diagnostic')
                                                        const isLayer1 = layer.name.toLowerCase().includes('layer 1')
                                                        const isLayer2 = layer.name.toLowerCase().includes('layer 2')

                                                        if (isDiagnostic && hasSubtopic) isRequired = false
                                                        if ((isLayer1 || isLayer2) && !hasSubtopic) isRequired = false
                                                    }

                                                    if (!isRequired) {
                                                        return (
                                                            <TableCell key={layer.id} className="text-center bg-gray-50/50 p-4">
                                                                <div className="flex justify-center items-center h-full opacity-30" title="Not applicable">
                                                                    <div className="w-6 h-0.5 bg-gray-400 border-dashed border-t-2 border-gray-400"></div>
                                                                </div>
                                                            </TableCell>
                                                        )
                                                    }

                                                    return (
                                                        <TableCell key={layer.id} className="text-center p-2">
                                                            <div className="flex flex-col items-center justify-center gap-2">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    {getStatusIcon(row.layerStatuses[layer.id])}
                                                                    <span className="text-xs text-muted-foreground capitalize">{row.layerStatuses[layer.id]}</span>
                                                                </div>
                                                                <div className="flex gap-1">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="h-7 px-2 text-xs bg-white hover:bg-blue-50 hover:text-blue-600 border-gray-200"
                                                                        onClick={() => openResourceDialog(row, layer.id)}
                                                                    >
                                                                        <Plus className="h-3 w-3 mr-1" />
                                                                        Add
                                                                    </Button>
                                                                    {row.layerStatuses[layer.id] === 'complete' && (
                                                                        <Button
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            className="h-7 px-2 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                                            onClick={() => viewResources(row, layer.id)}
                                                                        >
                                                                            View
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                    )
                                                })}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            Add Resource: {selectedRow?.topicTitle}
                            {selectedRow?.subtopicTitle && ` → ${selectedRow.subtopicTitle}`}
                            {' '}({selectedRow?.layerName})
                        </DialogTitle>
                    </DialogHeader>
                    {selectedRow && (
                        <ResourceForm
                            prefilledData={{
                                topicId: selectedRow.topicId,
                                subtopicId: selectedRow.subtopicId,
                                layerId: selectedRow.layerId
                            }}
                            onSuccess={() => {
                                setDialogOpen(false)
                                loadTopicsTable() // Refresh the table
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
